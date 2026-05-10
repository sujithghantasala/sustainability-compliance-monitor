# SECURITY.md

## Security Overview

The Sustainability Compliance Monitor protects compliance records with JWT authentication, server-side validation, soft deletes, audit logging, and controlled file handling. This document records the final Java Developer 2 security review for the database, backend API, React frontend, and demo-facing security behaviors.

## Threats Reviewed

| Threat | Risk | Control |
| --- | --- | --- |
| Unauthorized API access | Attackers could read, export, change, or delete compliance records. | `/api/**` endpoints require JWT except login and Swagger documentation. |
| Weak input validation | Invalid scores, statuses, or empty company names could corrupt reporting. | Bean Validation enforces required fields, score range, and approved statuses. |
| Accidental destructive delete | Records could be permanently removed without traceability. | `DELETE /api/{id}` now performs a soft delete and audit logging records the action. |
| CSV injection or malformed export | Commas, quotes, or line breaks could break exports. | CSV values are quoted and escaped before download. |
| Unsafe file upload | Large or unexpected file types could be uploaded. | Upload endpoint validates file presence, `.csv` extension, MIME type, and 2 MB size limit. |
| Secret exposure | Committed credentials could compromise local or deployed environments. | DB password and JWT secret are read from environment variables; no production secret is committed. |
| Missing audit trail | Create/update/delete actions could lack accountability. | Spring AOP captures CUD operations and writes to `audit_log`. |

## Findings And Fixes

| Finding | Fix |
| --- | --- |
| Hibernate was allowed to mutate schema directly. | Changed to validation mode; Flyway owns schema evolution. |
| Audit table migration did not match the JPA entity. | Rebuilt `V2__audit_log.sql` with `entity_id`, `username`, `details`, and `timestamp`. |
| Delete endpoint performed a hard delete. | Replaced with soft delete through the `deleted` column. |
| Upload endpoint accepted any file. | Added CSV type, extension, empty file, and size validation. |
| Static JWT secret existed in source. | Replaced with `JWT_SECRET` environment lookup and ephemeral generated fallback. |
| Frontend auth state was scattered in `localStorage`. | Added `AuthContext` and kept `ProtectedRoute` behind context state. |

## Residual Risks

| Risk | Notes |
| --- | --- |
| Demo credentials | Local fallback credentials are for development only; production must set `APP_USERNAME` and `APP_PASSWORD`. |
| JWT revocation | Tokens expire naturally, but there is no server-side revocation list. |
| CSV content trust | Uploaded CSV files are validated for type and size, but parsing/import workflows should validate every row before future persistence. |
| AI service dependency | AI output depends on the external/local AI service quality and availability. |

## Required Environment Variables

| Variable | Purpose |
| --- | --- |
| `DB_URL` | PostgreSQL JDBC URL. |
| `DB_USERNAME` | Database username. |
| `DB_PASSWORD` | Database password. |
| `JWT_SECRET` | HMAC signing key for JWT tokens. |
| `APP_USERNAME` | Login username. |
| `APP_PASSWORD` | Login password. |
| `AI_SERVICE_URL` | Optional AI service base URL. |

## Final Status

Security review is complete for Java Developer 2 responsibilities. Remaining operational checks should confirm the chosen deployment environment sets all required variables and that the Maven wrapper can run on a fresh machine.
