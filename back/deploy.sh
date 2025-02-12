#!/bin/bash
# Deployment script for pushing artifacts to Nexus using environment variables.

# Exit if any command fails
set -e

# Configuration from environment variables
NEXUS_USER="admin"
NEXUS_PASSWORD="07248363"
IMAGE_NAME="helatalbi/radiotherapieback"
IMAGE_VERSION="1.0"
NEXUS_REPO="192.168.50.10:8081/repository/radiotherapie"

echo "Starting deployment to Nexus..."


# Tagging the image
docker tag ${IMAGE_NAME}:${IMAGE_VERSION} ${NEXUS_REPO}/${IMAGE_NAME}:${IMAGE_VERSION}

# Login to Nexus
echo $NEXUS_PASSWORD | docker login ${NEXUS_REPO} -u ${NEXUS_USER} --password-stdin

# Push the image
docker push ${NEXUS_REPO}/${IMAGE_NAME}:${IMAGE_VERSION}

echo "Deployment completed successfully."
