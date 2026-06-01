# ====================================================================
# BIOSTATEER™ ENTERPRISE CLINICAL PLATFORM DEPLOYMENT - TERRAFORM INFRASTRUCTURE
# TARGET: Google Cloud Platform (GCP)
# Copyright © 2026 Dr. Bhupesh Dewan. All Rights Reserved.
# ====================================================================

terraform {
  required_version = ">= 1.3.0"
  required_providers {
    google = {
      source  = "hashicorp/google"
      version = "~> 5.0"
    }
  }
}

provider "google" {
  project = var.gcp_project_id
  region  = var.gcp_region
}

# 1. Enable Core GCP Service APIs
resource "google_project_service" "enabled_apis" {
  for_each = toset([
    "run.googleapis.com",
    "sqladmin.googleapis.com",
    "secretmanager.googleapis.com",
    "storage.googleapis.com",
    "compute.googleapis.com",
    "vpcaccess.googleapis.com"
  ])
  service            = each.key
  disable_on_destroy = false
}

# 2. Google Cloud Storage Bucket (Reports & Audit Trail Exports)
resource "google_storage_bucket" "exports_bucket" {
  name                        = "${var.gcp_project_id}-biostateer-exports"
  location                    = var.gcp_region
  storage_class               = "STANDARD"
  uniform_bucket_level_access = true

  versioning {
    enabled = true
  }

  encryption {
    default_kms_key_name = var.kms_key_name
  }
}

# 3. Google Secret Manager (Storing Database Credentials & JWT Secrets)
resource "google_secret_manager_secret" "jwt_secret" {
  secret_id = "jwt-secret"
  replication {
    auto {}
  }
}

resource "google_secret_manager_secret" "db_password" {
  secret_id = "database-password"
  replication {
    auto {}
  }
}

# 4. Google Cloud SQL (PostgreSQL Instance)
resource "google_sql_database_instance" "postgres_instance" {
  name             = "biostateer-postgres-prod"
  database_version = "POSTGRES_16"
  region           = var.gcp_region
  depends_on       = [google_project_service.enabled_apis]

  settings {
    tier = "db-custom-4-16384" # 4 vCPU, 16 GB RAM (Enterprise Grade)

    backup_configuration {
      enabled                        = true
      start_time                     = "02:00"
      point_in_time_recovery_enabled = true
      transaction_log_retention_days = 7
    }

    ip_configuration {
      ipv4_enabled    = false # Private IP only
      private_network = var.vpc_network_id
    }

    database_flags {
      name  = "log_connections"
      value = "on"
    }

    database_flags {
      name  = "log_disconnections"
      value = "on"
    }
  }
}

resource "google_sql_database" "biostateer_db" {
  name     = "biostateer"
  instance = google_sql_database_instance.postgres_instance.name
}

# 5. Cloud Run Service (FastAPI Backend)
resource "google_cloud_run_service" "backend_api" {
  name     = "biostateer-api"
  location = var.gcp_region

  template {
    spec {
      containers {
        image = "gcr.io/${var.gcp_project_id}/backend-api:v1.3.0"
        
        resources {
          limits = {
            memory = "4Gi"
            cpu    = "2000m"
          }
        }

        env {
          name  = "ENV"
          value = "production"
        }

        env {
          name = "JWT_SECRET"
          value_from {
            secret_key_ref {
              name = google_secret_manager_secret.jwt_secret.secret_id
              key  = "latest"
            }
          }
        }

        env {
          name  = "DATABASE_URL"
          value = "postgresql://postgres:db_pass_placeholder@${google_sql_database_instance.postgres_instance.private_ip_address}:5432/biostateer"
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# 6. Cloud Run Service (React + Vite Frontend)
resource "google_cloud_run_service" "frontend_client" {
  name     = "biostateer-frontend"
  location = var.gcp_region

  template {
    spec {
      containers {
        image = "gcr.io/${var.gcp_project_id}/frontend-client:v1.3.0"
        
        resources {
          limits = {
            memory = "2Gi"
            cpu    = "1000m"
          }
        }
      }
    }
  }

  traffic {
    percent         = 100
    latest_revision = true
  }
}

# Allow Public Access (HTTPS Gated internally by auth layouts)
resource "google_cloud_run_service_iam_member" "public_access_frontend" {
  service  = google_cloud_run_service.frontend_client.name
  location = google_cloud_run_service.frontend_client.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}

resource "google_cloud_run_service_iam_member" "public_access_backend" {
  service  = google_cloud_run_service.backend_api.name
  location = google_cloud_run_service.backend_api.location
  role     = "roles/run.invoker"
  member   = "allUsers"
}
