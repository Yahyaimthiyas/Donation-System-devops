#!/bin/bash

# Configuration
JENKINS_CONTAINER_NAME="jenkins"
IMAGE_NAME="custom-jenkins"

echo "🚀 Building Custom Jenkins Image..."
docker build -t $IMAGE_NAME -f ./infrastructure/jenkins/Dockerfile .

# Stop and remove existing Jenkins container if it exists
if [ "$(docker ps -aq -f name=$JENKINS_CONTAINER_NAME)" ]; then
    echo "🛑 Stopping existing Jenkins container..."
    docker stop $JENKINS_CONTAINER_NAME
    docker rm $JENKINS_CONTAINER_NAME
fi

# Ensure the shared network exists
echo "🌐 Checking Shared DevOps Network..."
docker network inspect devops-network >/dev/null 2>&1 || \
    docker network create --driver bridge --attachable devops-network

echo "✅ Starting Standalone Jenkins..."
docker run -d \
  --name $JENKINS_CONTAINER_NAME \
  -p 8080:8080 \
  -p 50000:50000 \
  -v jenkins_data:/var/jenkins_home \
  -v /var/run/docker.sock:/var/run/docker.sock \
  --network devops-network \
  --restart unless-stopped \
  $IMAGE_NAME

echo "------------------------------------------------"
echo "🎉 Jenkins is running at http://localhost:8080"
echo "------------------------------------------------"
echo "To get the Initial Admin Password, run:"
echo "docker exec $JENKINS_CONTAINER_NAME cat /var/jenkins_home/secrets/initialAdminPassword"
