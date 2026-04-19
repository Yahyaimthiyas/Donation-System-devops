pipeline {
    agent any

    environment {
        PORT = '5000'
        NODE_ENV = 'production'
        REACT_APP_API_URL = 'http://172.27.240.23:5000'
        CLIENT_URL = 'http://172.27.240.23:3000'
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

        stage('Prepare Environment') {
            steps {
                echo 'Creating .env file for deployment...'
                // Pull credentials only when needed to avoid initial environment failures
                withCredentials([
                    string(credentialsId: 'MONGO_URI', variable: 'DB_URI'),
                    string(credentialsId: 'JWT_SECRET', variable: 'JWT_KEY'),
                    string(credentialsId: 'RAZORPAY_KEY_ID', variable: 'RZP_ID'),
                    string(credentialsId: 'RAZORPAY_KEY_SECRET', variable: 'RZP_SECRET')
                ]) {
                    sh """
                        echo "PORT=${PORT}" > .env
                        echo "NODE_ENV=${NODE_ENV}" >> .env
                        echo "MONGO_URI=${DB_URI}" >> .env
                        echo "JWT_SECRET=${JWT_KEY}" >> .env
                        echo "REACT_APP_API_URL=${REACT_APP_API_URL}" >> .env
                        echo "CLIENT_URL=${CLIENT_URL}" >> .env
                        echo "RAZORPAY_KEY_ID=${RZP_ID}" >> .env
                        echo "RAZORPAY_KEY_SECRET=${RZP_SECRET}" >> .env
                        echo ".env file created securely."
                        
                        # Copy .env to client folder for React build
                        cp .env client/.env
                    """
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

        stage('Deploy') {
            steps {
                echo '🚀 Deploying Application via Docker Compose...'
                // Self-healing: Stop and remove old/stuck containers before starting new ones
                sh 'docker compose down --remove-orphans || true'
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
