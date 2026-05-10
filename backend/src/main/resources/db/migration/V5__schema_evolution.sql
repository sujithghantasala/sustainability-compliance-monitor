ALTER TABLE compliance_record ALTER COLUMN id TYPE BIGINT;
ALTER TABLE compliance_record ALTER COLUMN compliance_score SET DEFAULT 0;
UPDATE compliance_record SET compliance_score = 0 WHERE compliance_score IS NULL;
ALTER TABLE compliance_record ALTER COLUMN compliance_score SET NOT NULL;
UPDATE compliance_record SET status = 'PENDING_REVIEW' WHERE status IS NULL OR status NOT IN ('COMPLIANT', 'NON-COMPLIANT', 'PENDING_REVIEW');
ALTER TABLE compliance_record ALTER COLUMN status SET NOT NULL;
ALTER TABLE compliance_record ALTER COLUMN created_at SET NOT NULL;

ALTER TABLE compliance_record ADD COLUMN IF NOT EXISTS deleted BOOLEAN NOT NULL DEFAULT FALSE;
ALTER TABLE compliance_record ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_compliance_score_range'
    ) THEN
        ALTER TABLE compliance_record
            ADD CONSTRAINT chk_compliance_score_range CHECK (compliance_score >= 0 AND compliance_score <= 100);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'chk_compliance_status'
    ) THEN
        ALTER TABLE compliance_record
            ADD CONSTRAINT chk_compliance_status CHECK (status IN ('COMPLIANT', 'NON-COMPLIANT', 'PENDING_REVIEW'));
    END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_compliance_record_created_at ON compliance_record(created_at);
CREATE INDEX IF NOT EXISTS idx_compliance_record_deleted ON compliance_record(deleted);

ALTER TABLE audit_log ALTER COLUMN id TYPE BIGINT;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS entity_id BIGINT;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS username VARCHAR(255);
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS details TEXT;
ALTER TABLE audit_log ADD COLUMN IF NOT EXISTS timestamp TIMESTAMP;

UPDATE audit_log SET username = 'system' WHERE username IS NULL;
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'audit_log'
          AND column_name = 'created_at'
    ) THEN
        EXECUTE 'UPDATE audit_log SET timestamp = created_at WHERE timestamp IS NULL';
    ELSE
        UPDATE audit_log SET timestamp = CURRENT_TIMESTAMP WHERE timestamp IS NULL;
    END IF;
END $$;
ALTER TABLE audit_log ALTER COLUMN username SET NOT NULL;
ALTER TABLE audit_log ALTER COLUMN timestamp SET NOT NULL;

CREATE INDEX IF NOT EXISTS idx_audit_log_entity ON audit_log(entity, entity_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_action ON audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_log_timestamp ON audit_log(timestamp);
