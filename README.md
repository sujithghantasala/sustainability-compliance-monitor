# Sustainability Compliance Monitor
### Day 4
* Developed AiServiceClient.java using Spring RestTemplate.
* Configured a 10-second timeout.
* Implemented fail-safe error handling.

### 📅 Day 9
* Conducted Week 2 Security Sign-off.
* Verified JWT authentication mechanisms in the backend.
* Confirmed Flask-Limiter successfully prevents API abuse.
* Audited and validated prompt injection defenses.
* Completed PII audit, confirming zero exposure of sensitive data.

### 📅 Day 10
* Conducted a comprehensive **AI Quality Review** with 10 fresh ESG-related inputs.
* Achieved an average accuracy score of **5/5** based on expert guidelines.
* Fixed failing prompts by tuning the system instruction for consistent multi-section responses.
* Created `AI_QUALITY_REVIEW.md` to document test results and model performance.

### 📅 Day 11
* **Full Stack Containerization**: Created Dockerfiles for `backend`, `ai-service`, and `frontend`.
* **Orchestration**: Implemented `docker-compose.yml` to manage the multi-service architecture including PostgreSQL.
* **Service Discovery**: Updated `AiServiceClient.java` and `app.py` to support containerized service communication via environment variables.
* **E2E Verification**: Verified AI integration within the `ai-service` container environment (using Groq API).
* **Environment Readiness**: Prepared `.env` templates for secure API key management.
