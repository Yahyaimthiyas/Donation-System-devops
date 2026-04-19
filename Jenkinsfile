pipeline {
    agent any

    environment {
        NODE_ENV = 'development'
    }

    stages {
        stage('Checkout & Info') {
            steps {
                echo 'Checking out code...'
                checkout scm
                sh 'node -v'
                sh 'npm -v'
            }
        }

        stage('Install Backend Dependencies') {
            steps {
                echo 'Installing Node.js dependencies for backend...'
                sh 'npm install'
            }
        }

        stage('Install Frontend Dependencies') {
            steps {
                echo 'Installing Node.js dependencies for frontend client...'
                dir('client') {
                    sh 'npm install'
                }
            }
        }

        stage('Test Frontend') {
            steps {
                echo 'Running frontend tests...'
                dir('client') {
                    // Running with CI=true to prevent interactive prompts for tests
                    sh 'CI=true npm test'
                }
            }
        }

        stage('Build Frontend') {
            steps {
                echo 'Building frontend specifically for production deployment...'
                dir('client') {
                    sh 'npm run build'
                }
            }
        }

        stage('Prepare Environment') {
            steps {
                echo 'Creating .env file for deployment...'
                // Ensure a .env file exists for docker-compose
                sh '''
                    if [ ! -f .env ]; then
                        echo "PORT=5000" > .env
                        echo "NODE_ENV=production" >> .env
                        echo "MONGO_URI=mongodb://mongo:27017/donationdb" >> .env
                        echo "JWT_SECRET=7hGk92!kLpQx#9@secureRandomKey2026" >> .env
                        echo "REACT_APP_API_URL=http://localhost:5000" >> .env
                        echo ".env file created with default values."
                    else
                        echo ".env file already exists."
                    fi
                '''
            }
        }

        stage('Deploy') {
            steps {
                echo '🚀 Deploying Application via Docker Compose...'
                // Build and restart the containers
                // Using --build to ensure code changes are picked up
                sh 'docker compose up -d --build'
            }
        }

        stage('Clean Up') {
            steps {
                echo '🧹 cleaning up dangling images...'
                sh 'docker image prune -f'
            }
        }
    }

    post {
        always {
            echo "Pipeline complete. Duration and success metrics are being captured by Prometheus via the Jenkins Prometheus Exporter plugin."
        }
        success {
            echo "Build successful!"
        }
        failure {
            echo "Build failed! Please review the console output."
        }
    }
}
