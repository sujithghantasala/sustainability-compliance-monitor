# Sustainability Compliance Monitoring System

## Overview

A full-stack application to track, manage, and analyze company sustainability compliance records.
Includes CRUD operations, search/filtering, JWT authentication, AI-based recommendations (mock), analytics dashboard, CSV export, and file upload.

---

## Tech Stack

### Backend

* Java (Spring Boot)
* Spring Security (JWT)
* Spring Data JPA
* PostgreSQL
* Swagger (OpenAPI)

### Frontend

* React (Vite)
* Axios
* Tailwind CSS

---

## Features

### Core

* Create, Read, Update, Delete compliance records
* Search companies by name
* Filter by compliance status

### Security

* JWT-based authentication
* Protected API routes

### AI (Mock)

* Generates compliance recommendations based on company data

### Analytics

* Dashboard with compliance distribution (charts)

### File Handling

* Export records as CSV
* Upload CSV file (validated)

### API Documentation

* Swagger UI for testing endpoints

---

## Project Structure

```
backend/
  src/main/java/com/internship/tool/
    controller/
    service/
    repository/
    config/

frontend/
  src/
    pages/
    components/
    services/
```

---

## Setup Instructions

### Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

Runs on:

```
http://localhost:8080
```

---

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Runs on:

```
http://localhost:5173
```

---

## API Endpoints

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| POST   | /api/auth/login      | Login (get JWT)  |
| GET    | /api/all             | Get all records  |
| GET    | /api/{id}            | Get record by ID |
| POST   | /api/create          | Create record    |
| PUT    | /api/{id}            | Update record    |
| DELETE | /api/{id}            | Delete record    |
| GET    | /api/search?q=       | Search           |
| GET    | /api/status/{status} | Filter           |
| POST   | /api/ai/recommend    | AI suggestions   |
| GET    | /api/export          | Download CSV     |
| POST   | /api/upload          | Upload CSV       |

---

## Authentication

1. Login:

```json
POST /api/auth/login
{
  "username": "admin",
  "password": "admin"
}
```

2. Use token:

```
Authorization: Bearer <token>
```

---

## Swagger

```
http://localhost:8080/swagger-ui/index.html
```

---

## Testing

```bash
mvn test
```

Includes:

* Controller tests (MockMvc)

---

## Notes

* AI feature is currently mocked
* CSV upload validates file type and size
* Token must be refreshed after backend restart

---

## Status

Project implementation complete (Day 12).
Ready for demo and review.

---

