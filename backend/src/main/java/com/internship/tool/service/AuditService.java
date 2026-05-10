package com.internship.tool.service;

import com.internship.tool.model.AuditLog;
import com.internship.tool.repository.AuditLogRepository;
import org.springframework.stereotype.Service;

@Service
public class AuditService {

    private final AuditLogRepository repo;

    public AuditService(AuditLogRepository repo) {
        this.repo = repo;
    }

    public void log(String action, String entity, Long entityId, String username, String details) {
        AuditLog log = new AuditLog();
        log.setAction(action);
        log.setEntity(entity);
        log.setEntityId(entityId);
        log.setUsername(username);
        log.setDetails(details);

        repo.save(log);
    }
}
