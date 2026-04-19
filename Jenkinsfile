pipeline {
    agent any

    tools {
        // This must match the name you set in: Manage Jenkins → Tools → NodeJS installations
        nodejs 'NodeJS-18'
    }

    environment {
        NODE_ENV = 'development'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out code...'
                checkout scm
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

        stage('Deploy') {
            steps {
                echo 'Skipping deployment for now. Add your deployment logic here when ready.'
                // sh 'npm start' or similar deployment command
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
