package com.internship.tool.aop;

import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

import com.internship.tool.entity.ComplianceRecord;
import com.internship.tool.service.AuditService;

@Aspect
@Component
public class AuditAspect {

    private final AuditService auditService;

    public AuditAspect(AuditService auditService) {
        this.auditService = auditService;
    }

    private String getUsername() {
        return SecurityContextHolder.getContext()
                .getAuthentication()
                .getName();
    }

    // 🔹 CREATE
    @AfterReturning(
        pointcut = "execution(* com.internship.tool.controller.ComplianceController.create(..))",
        returning = "result"
    )
    public void logCreate(Object result) {
        ComplianceRecord saved = (ComplianceRecord) result;

        auditService.log(
                "CREATE",
                "ComplianceRecord",
                saved.getId(),
                getUsername(),
                "Created record"
        );
    }

    // 🔹 UPDATE
    @AfterReturning(
        pointcut = "execution(* com.internship.tool.controller.ComplianceController.update(..))"
    )
    public void logUpdate(JoinPoint joinPoint) {
        Long id = (Long) joinPoint.getArgs()[0];

        auditService.log(
                "UPDATE",
                "ComplianceRecord",
                id,
                getUsername(),
                "Updated record"
        );
    }

    // 🔹 DELETE
    @AfterReturning(
        pointcut = "execution(* com.internship.tool.controller.ComplianceController.delete(..))"
    )
    public void logDelete(JoinPoint joinPoint) {
        Long id = (Long) joinPoint.getArgs()[0];

        auditService.log(
                "DELETE",
                "ComplianceRecord",
                id,
                getUsername(),
                "Deleted record"
        );
    }
}