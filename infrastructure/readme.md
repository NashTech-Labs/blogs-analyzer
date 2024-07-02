
## Deploy gcp resources through terraform

### 1. Authenticate gcloud
```
Install gcloud cli if not installed https://cloud.google.com/sdk/docs/install 
a) export GOOGLE_APPLICATION_CREDENTIALS=key.json
b) gcloud auth activate-service-account --key-file=$GOOGLE_APPLICATION_CREDENTIALS
```

### 2. Install 
  - terraform in your local
  https://askubuntu.com/questions/983351/how-to-install-terraform-in-ubuntu
  - Install gcloud kubectl
  https://cloud.google.com/kubernetes-engine/docs/how-to/cluster-access-for-kubectl#install_kubectl
  - Install helm 
   ```snap install helm --classic```
  - Keep the service account json key (key.json) inside terraform directory and it should have the permission
   ```
    AI Platform Admin
    AI Platform Developer
    Artifact Registry Administrator
    Artifact Registry Create-on-Push Repository Administrator
    Compute Instance Admin (beta)
    Contact Centre AI Platform admin
    Editor
    Kubernetes Engine Admin
    Kubernetes Engine Cluster Admin
    Service Account User
    Vertex AI administrator
    
   ```
 - Check the [terraform.tfvars](terraform%2Fterraform.tfvars) file for the gcp project and credentials values and path.

### 3. run -

- terraform init
- terraform plan
- terraform apply

To destroy the all gcp resources
- terraform destroy

### 4. Resources Created on Google Cloud Platform (GCP)
After a successful Terraform execution, the resources listed below are generated on Google Cloud Platform (GCP)
- Google Kubernetes Engine
  - blogs-analyzer


