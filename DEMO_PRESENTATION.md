# Demo Presentation

## Slide 1: Problem

Organizations need a simple way to track sustainability compliance records, identify weak scores, preserve audit history, and prepare evidence for review. Manual spreadsheets make search, exports, and remediation tracking slow and error-prone.

## Slide 2: Architecture

React 18 + Vite frontend calls a Spring Boot API secured with JWT. PostgreSQL schema is managed by Flyway migrations. Spring Data JPA handles compliance records, Spring AOP writes create/update/delete events to `audit_log`, and the AI panel calls the backend AI endpoints.

## Slide 3: Demo Flow

1. Sign in.
2. Open Dashboard and show the 4 KPI cards plus Recharts status chart.
3. Go to Records, use debounced search, status filter, and date range.
4. Open a detail page, show score badge, edit/delete actions, and AI response card.
5. Export CSV and show upload validation.
6. Open Analytics and switch reporting period.
7. Explain security: JWT protection, soft delete, audit logging, validated upload, and environment-based secrets.

## Expected Outputs

| Scenario | Expected Output |
| --- | --- |
| Login | JWT saved and dashboard opens. |
| Search/filter | Records table narrows without page reload. |
| CSV export | Browser downloads `records.csv`. |
| Upload invalid file | API returns validation error. |
| Delete record | Record disappears from active list and audit aspect logs DELETE. |
| AI summary | Loading spinner appears, then formatted AI card renders. |
| Responsive check | Records and charts remain usable at 375px, 768px, and 1280px. |

## Talking Points

- Flyway owns schema evolution; Hibernate validates only.
- Seeder migration provides 30 realistic records.
- Soft delete protects auditability.
- MockMvc verifies endpoint status codes and validation paths.
- React uses AuthContext, ProtectedRoute, Axios base URL, and Recharts.
