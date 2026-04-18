# 🎗️ Charity Donation Platform

A production-grade, full-stack web application designed for managing charitable donations, fundraising drives, and transparent campaigning. This project is built using a professional **Modular Architecture** and follows industry best practices for security, scalability, and DevOps.

![Charity Platform](https://img.shields.io/badge/React-19.1.0-blue)
![Node.js](https://img.shields.io/badge/Node.js-Express-green)
![MongoDB](https://img.shields.io/badge/MongoDB-8.14.1-green)
![Docker](https://img.shields.io/badge/Docker-Enabled-blue)
![Jenkins](https://img.shields.io/badge/CI%2FCD-Jenkins-orange)

## 📋 Table of Contents

- [Core Principles](#-core-principles)
- [Architecture](#-architecture)
- [Security Features](#-security-features)
- [Technology Stack](#-technology-stack)
- [Installation & Setup](#-installation--setup)
- [Docker Deployment](#-docker-deployment)
- [CI/CD Monitoring](#-cicd-monitoring)

## 🎯 Core Principles

- **Separation of Concerns**: Clean separation between routing, business logic (Controllers), and data persistence (Models).
- **Security First**: Comprehensive protection against common web vulnerabilities.
- **Observability**: Integrated monitoring with Prometheus and Grafana for pipeline health.
- **Scalability**: Decoupled Frontend and Backend, fully containerized for seamless deployment.

## 🏗️ Architecture

The backend follows a **Modular Controller-Route Pattern**:
- **Routes**: Define API endpoints and apply standard validation.
- **Controllers**: Handle HTTP requests, manage response formatting, and contain core business logic.
- **Models**: Mongoose schemas defining our data structure with rigorous validation.
- **Middleware**: Centralized error handling, authentication, and security layers.

### 📁 Project Structure

```
donation-system/
├── client/                 # React frontend
│   ├── src/
│   │   ├── services/       # Centralized API service with Axios interceptors
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # Auth and global state management
│   │   └── pages/          # View-level components
├── controllers/            # Modular business logic handlers
├── middleware/             # Global error handler & Async utility
├── models/                 # Mongoose schemas with field validation
├── routes/                 # Clean API route definitions
├── infrastructure/         # Prometheus & Grafana configuration
├── infrastructure/grafana/ # Grafana dashboards and provisioning
├── Dockerfile              # Backend containerization
├── docker-compose.yml      # Orchestration for Full Stack (App, DB, & Monitoring)
└── .env.example            # Environment template for standard setup
```

## 🔒 Security Features

This application implements multi-layered security:
- **Helmet**: Secures apps by setting various HTTP headers.
- **Express-Rate-Limit**: Prevents brute-force attacks by limiting request rates.
- **Mongo-Sanitize**: Prevents NoSQL injection attacks.
- **XSS-Clean**: Sanitizes user input to prevent Cross-Site Scripting (XSS).
- **HPP**: Protects against HTTP Parameter Pollution.
- **JWT**: Stateless session management with securely hashed passwords using **Bcrypt**.
- **Role Guard**: Professional privilege escalation prevention (e.g., Restricted Admin Registration).

## 🛠️ Technology Stack

### Frontend
- **React 19**, **Axios** (Centralized Service), **Socket.io Client**, **Styled Components**.

### Backend
- **Node.js**, **Express**, **MongoDB Atlas**, **Socket.io**, **Morgan** (Dev Logging).

### DevOps & Observability
- **Docker & Docker Compose**, **Jenkins Pipeline**, **Prometheus**, **Grafana**.

## 🚀 Installation & Setup

### Environment Setup
1. Copy the example environment file: `cp .env.example .env`
2. Update the `MONGO_URI` and `JWT_SECRET` in `.env`.

### Running with Docker (Recommended)
This command starts the **Backend, Frontend, MongoDB, Prometheus, and Grafana** all at once:
```bash
docker-compose up -d
```

### Standard Running
```bash
# Backend
npm install
npm start

# Frontend
cd client
npm install
npm start
```

## 📊 Observability & Monitoring

The project includes a pre-configured monitoring stack for system health and pipeline visualization:
- **Prometheus**: Scrapes metrics from the Express API (`/metrics`).
- **Grafana**: Real-time dashboards for API health and pipeline stats.

Access dashboards at:
- **Charity App**: `http://localhost:3000`
- **Grafana**: `http://localhost:3001` (Default login: `admin` / `admin`)
- **Prometheus**: `http://localhost:9090`
- **API Docs**: `http://localhost:5000/api-docs` (Swagger)


---
**Developed by Yahya Imthiyas**
*Professional Project Refactor - 2026*