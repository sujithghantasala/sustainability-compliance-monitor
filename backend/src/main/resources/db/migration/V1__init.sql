CREATE TABLE IF NOT EXISTS compliance_record (
    id BIGSERIAL PRIMARY KEY,
    company_name VARCHAR(255) NOT NULL,
    compliance_score INTEGER NOT NULL,
    status VARCHAR(50) NOT NULL,
    description TEXT,
    deleted BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP,
    CONSTRAINT uk_compliance_record_company_name UNIQUE (company_name),
    CONSTRAINT chk_compliance_score_range CHECK (compliance_score >= 0 AND compliance_score <= 100),
    CONSTRAINT chk_compliance_status CHECK (status IN ('COMPLIANT', 'NON-COMPLIANT', 'PENDING_REVIEW'))
);

CREATE INDEX IF NOT EXISTS idx_compliance_record_status ON compliance_record(status);
CREATE INDEX IF NOT EXISTS idx_compliance_record_company_name ON compliance_record(company_name);
CREATE INDEX IF NOT EXISTS idx_compliance_record_created_at ON compliance_record(created_at);
CREATE INDEX IF NOT EXISTS idx_compliance_record_deleted ON compliance_record(deleted);
