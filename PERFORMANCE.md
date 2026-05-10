# Performance Verification

## Indexed Fields

Flyway migration `V1__init.sql` adds indexes for the highest-traffic filters:

| Index | Purpose |
| --- | --- |
| `idx_compliance_record_status` | Speeds status dropdown filtering and dashboard counts. |
| `idx_compliance_record_company_name` | Speeds company search. |
| `idx_compliance_record_created_at` | Speeds date-range filtering and newest-first ordering. |
| `idx_compliance_record_deleted` | Keeps soft-deleted rows out of active workflows efficiently. |

Flyway migration `V2__audit_log.sql` adds audit indexes:

| Index | Purpose |
| --- | --- |
| `idx_audit_log_entity` | Speeds audit lookup by entity and entity id. |
| `idx_audit_log_action` | Speeds CUD action filtering. |
| `idx_audit_log_timestamp` | Speeds recent audit review. |

## EXPLAIN ANALYZE Checks

Run these against PostgreSQL after migrations are applied:

```sql
EXPLAIN ANALYZE
SELECT *
FROM compliance_record
WHERE deleted = false
  AND LOWER(company_name) LIKE LOWER('%green%')
ORDER BY created_at DESC;

EXPLAIN ANALYZE
SELECT *
FROM compliance_record
WHERE deleted = false
  AND status = 'NON-COMPLIANT'
ORDER BY created_at DESC;

EXPLAIN ANALYZE
SELECT AVG(compliance_score)
FROM compliance_record
WHERE deleted = false;

EXPLAIN ANALYZE
SELECT *
FROM audit_log
WHERE entity = 'ComplianceRecord'
  AND entity_id = 1
ORDER BY timestamp DESC;
```

## N+1 Review

The current compliance domain uses single-table `ComplianceRecord` queries and does not traverse lazy relationships from controller responses. No N+1 query path is present in the owned endpoints.
