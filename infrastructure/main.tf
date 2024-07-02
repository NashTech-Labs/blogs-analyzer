terraform {
  required_providers {
    google = {
      version = "5.6.0"
      source = "hashicorp/google"
    }
  }
}

# Configure Google Cloud Provider
provider "google" {
  project = var.app_project
  credentials = file(var.gcp_auth_file)
  region  = var.gcp_region_1
  zone    = var.gcp_zone_1
}


#-----------------------GKE Cluster for applications----------------------------
resource "google_container_cluster" "blogs-analyzer" {
  name     = "blogs-analyzer"
  location = var.gcp_region_1
  ip_allocation_policy {
    cluster_ipv4_cidr_block  = ""
    services_ipv4_cidr_block = ""
  }
  enable_autopilot = true
  deletion_protection = false
}


#----------------Artifact Registry Repository Docker--------------
resource "google_artifact_registry_repository" "blogs-analyzer-repository" {
  location = var.gcp_region_1
  repository_id = "blogs-analyzer-repository"
  description   = "blogs-analyzer docker repository"
  format        = "DOCKER"

  docker_config {
    immutable_tags = false
  }
}
