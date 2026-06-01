variable "gcp_project_id" {
  type        = string
  description = "The target Google Cloud Platform Project ID."
}

variable "gcp_region" {
  type        = string
  default     = "us-central1"
  description = "The GCP region for deployment resources."
}

variable "vpc_network_id" {
  type        = string
  description = "The VPC network ID for database connection bindings."
}

variable "kms_key_name" {
  type        = string
  description = "The Google Cloud KMS Key Name for default customer-managed encryption."
}
