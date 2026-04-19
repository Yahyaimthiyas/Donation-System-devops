pipeline {
    agent any

    environment {
        // Securely bound credentials from Jenkins
        MONGO_URI           = credentials('MONGO_URI')
        JWT_SECRET          = credentials('JWT_SECRET')
        RAZORPAY_KEY_ID      = credentials('RAZORPAY_KEY_ID')
        RAZORPAY_KEY_SECRET  = credentials('RAZORPAY_KEY_SECRET')
        
        PORT = '5000'
        NODE_ENV = 'production'
        REACT_APP_API_URL = 'http://172.27.240.23:5000'
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
                // Ensure a .env file exists for docker-compose with SECURE values
                sh '''
                    echo "PORT=${PORT}" > .env
                    echo "NODE_ENV=${NODE_ENV}" >> .env
                    echo "MONGO_URI=${MONGO_URI}" >> .env
                    echo "JWT_SECRET=${JWT_SECRET}" >> .env
                    echo "REACT_APP_API_URL=${REACT_APP_API_URL}" >> .env
                    echo "RAZORPAY_KEY_ID=${RAZORPAY_KEY_ID}" >> .env
                    echo "RAZORPAY_KEY_SECRET=${RAZORPAY_KEY_SECRET}" >> .env
                    echo ".env file created securely."
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
