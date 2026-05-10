package com.internship.tool.repository;

import com.internship.tool.entity.ComplianceRecord;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.repository.query.Param;
import org.springframework.data.jpa.repository.Query;

public interface ComplianceRepository extends JpaRepository<ComplianceRecord, Long> {

    List<ComplianceRecord> findByDeletedFalseOrderByCreatedAtDesc();

    List<ComplianceRecord> findByCompanyNameContainingIgnoreCaseAndDeletedFalseOrderByCreatedAtDesc(String name);

    List<ComplianceRecord> findByStatusIgnoreCaseAndDeletedFalseOrderByCreatedAtDesc(String status);

    @Query("""
            SELECT c FROM ComplianceRecord c
            WHERE c.deleted = false
              AND (:q IS NULL OR LOWER(c.companyName) LIKE LOWER(CONCAT('%', :q, '%')))
              AND (:status IS NULL OR LOWER(c.status) = LOWER(:status))
              AND (:fromDate IS NULL OR c.createdAt >= :fromDate)
              AND (:toDate IS NULL OR c.createdAt <= :toDate)
            ORDER BY c.createdAt DESC
            """)
    List<ComplianceRecord> searchActive(
            @Param("q") String q,
            @Param("status") String status,
            @Param("fromDate") LocalDateTime fromDate,
            @Param("toDate") LocalDateTime toDate);

    long countByDeletedFalse();

    long countByStatusIgnoreCaseAndDeletedFalse(String status);

    @Query("SELECT AVG(c.complianceScore) FROM ComplianceRecord c WHERE c.deleted = false")
    Double findAverageScore();
}
