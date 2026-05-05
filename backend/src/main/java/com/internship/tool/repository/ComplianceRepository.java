package com.internship.tool.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.internship.tool.entity.ComplianceRecord;

import java.util.List;

public interface ComplianceRepository extends JpaRepository<ComplianceRecord, Long> {

    // 🔍 search
    List<ComplianceRecord> findByCompanyNameContainingIgnoreCase(String name);

    // 🔍 filter
    List<ComplianceRecord> findByStatus(String status);

    // 📊 dashboard (case-insensitive)
    long countByStatusIgnoreCase(String status);

    @Query("SELECT AVG(c.complianceScore) FROM ComplianceRecord c")
    Double findAverageScore();
}