# Stage 1: Build the static assets
FROM node:20-alpine AS build

# Build-time environment variables for Vite metadata
ARG VITE_APP_VERSION=1.3.2
ARG VITE_BUILD_DATE=2026.06.01
ARG VITE_VALIDATION_REGISTRY=1.0

ENV VITE_APP_VERSION=$VITE_APP_VERSION
ENV VITE_BUILD_DATE=$VITE_BUILD_DATE
ENV VITE_VALIDATION_REGISTRY=$VITE_VALIDATION_REGISTRY

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Stage 2: Serve the compiled static assets using Nginx
FROM nginx:alpine

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Copy build output to Nginx web server directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
