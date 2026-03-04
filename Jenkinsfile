pipeline {
agent any

```
stages {

    stage('Clone Repository') {
        steps {
            git 'https://github.com/HavinashReddy-2882/cdd-docker-web-deploy.git'
        }
    }

    stage('Build Backend Image') {
        steps {
            sh 'docker build -t cdd-backend -f backend-springboot/backend.Dockerfile backend-springboot'
        }
    }

    stage('Build Frontend Image') {
        steps {
            sh 'docker build -t cdd-frontend -f frontend-react/frontend.Dockerfile frontend-react'
        }
    }

    stage('Run Docker Compose') {
        steps {
            sh 'docker compose down || true'
            sh 'docker compose up -d --build'
        }
    }

}
```

}
