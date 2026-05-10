package com.internship.tool.aop;

import com.internship.tool.entity.ComplianceRecord;
import com.internship.tool.service.AuditService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditAspect {

    private final AuditService auditService;

    public AuditAspect(AuditService auditService) {
        this.auditService = auditService;
    }

    @AfterReturning(
            pointcut = "execution(* com.internship.tool.controller.ComplianceController.create(..))",
            returning = "result"
    )
    public void logCreate(Object result) {
        ComplianceRecord saved = extractRecord(result);

        auditService.log(
                "CREATE",
                "ComplianceRecord",
                saved.getId(),
                getUsername(),
                "Created record"
        );
    }

    @AfterReturning(pointcut = "execution(* com.internship.tool.controller.ComplianceController.update(..))")
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

    @AfterReturning(pointcut = "execution(* com.internship.tool.controller.ComplianceController.delete(..))")
    public void logDelete(JoinPoint joinPoint) {
        Long id = (Long) joinPoint.getArgs()[0];

        auditService.log(
                "DELETE",
                "ComplianceRecord",
                id,
                getUsername(),
                "Soft deleted record"
        );
    }

    private ComplianceRecord extractRecord(Object result) {
        if (result instanceof org.springframework.http.ResponseEntity<?> response
                && response.getBody() instanceof ComplianceRecord record) {
            return record;
        }

        return (ComplianceRecord) result;
    }

    private String getUsername() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || authentication.getName() == null) {
            return "system";
        }

        return authentication.getName();
    }
}
