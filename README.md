# Sustainability Compliance Monitoring System

Full-stack application for tracking, searching, auditing, exporting, and analyzing company sustainability compliance records.

## Tech Stack

### Backend

- Java 17
- Spring Boot
- Spring Security with JWT
- Spring Data JPA
- Flyway
- PostgreSQL
- Swagger/OpenAPI

### Frontend

- React 18
- Vite
- Axios
- Tailwind CSS
- Recharts

## Setup

1. Create environment variables from `.env.example`.
2. Start PostgreSQL and create the configured database.
3. Run the backend:

```bash
cd backend
cmd /c mvnw.cmd spring-boot:run
```

4. Run the frontend:

```bash
cd frontend
npm install
npm run dev
```

Backend runs on `http://localhost:8080`.
Frontend runs on `http://localhost:5173`.

## API

| Method | Endpoint | Description |
| --- | --- | --- |
| `POST` | `/api/auth/login` | Login and receive JWT. |
| `GET` | `/api/all` | List active records. |
| `GET` | `/api/{id}` | Get active record by ID. |
| `POST` | `/api/create` | Create record. |
| `PUT` | `/api/{id}` | Update record. |
| `DELETE` | `/api/{id}` | Soft delete record. |
| `GET` | `/api/search?q=&status=&from=&to=` | Search and filter. |
| `GET` | `/api/status/{status}` | Filter by status. |
| `GET` | `/api/stats` | Dashboard statistics. |
| `GET` | `/api/export` | Download CSV. |
| `POST` | `/api/upload` | Validate CSV upload. |
| `POST` | `/api/ai/describe` | AI summary. |
| `POST` | `/api/ai/recommend` | AI recommendations. |
| `POST` | `/api/ai/report` | AI report. |

Swagger UI: `http://localhost:8080/swagger-ui/index.html`

## Database

Flyway migrations live in `backend/src/main/resources/db/migration`.

- `V1__init.sql`: core table, constraints, and indexes.
- `V2__audit_log.sql`: audit table and indexes.
- `V3__seed_30_compliance_records.sql`: 30 realistic seed records.

Hibernate is set to `ddl-auto=validate`; schema changes should go through Flyway only.

## Testing

```bash
cd backend
cmd /c mvnw.cmd test

cd frontend
npm run build
```

MockMvc covers create, read, update, soft delete, search, CSV export, upload validation, and error statuses.
