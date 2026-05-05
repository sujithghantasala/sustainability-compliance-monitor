package com.internship.tool.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "compliance_record")
public class ComplianceRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank(message = "Company name is required")
    @Column(name = "company_name")
    private String companyName;

    @Min(value = 0, message = "Score must be >= 0")
    @Max(value = 100, message = "Score must be <= 100")
    @Column(name = "compliance_score")
    private Integer complianceScore;

    @NotBlank(message = "Status is required")
    @Column
    private String status;

    @Column
    private String description;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    // getters + setters
    public Long getId() { return id; }
    public String getCompanyName() { return companyName; }
    public Integer getComplianceScore() { return complianceScore; }
    public String getStatus() { return status; }
    public String getDescription() { return description; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    public void setId(Long id) { this.id = id; }
    public void setCompanyName(String companyName) { this.companyName = companyName; }
    public void setComplianceScore(Integer complianceScore) { this.complianceScore = complianceScore; }
    public void setStatus(String status) { this.status = status; }
    public void setDescription(String description) { this.description = description; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}