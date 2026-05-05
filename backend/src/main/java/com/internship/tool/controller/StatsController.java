package com.internship.tool.controller;

import org.springframework.web.bind.annotation.*;

import com.internship.tool.repository.ComplianceRepository;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class StatsController {

    private final ComplianceRepository repository;

    public StatsController(ComplianceRepository repository) {
        this.repository = repository;
    }

    @GetMapping("/stats")
    public Map<String, Object> getStats() {

        long total = repository.count();
        long compliant = repository.countByStatusIgnoreCase("compliant");
        long nonCompliant = repository.countByStatusIgnoreCase("non-compliant");

        Double avgScore = repository.findAverageScore();

        Map<String, Object> stats = new HashMap<>();
        stats.put("total", total);
        stats.put("compliant", compliant);
        stats.put("nonCompliant", nonCompliant);
        stats.put("avgScore", avgScore);

        return stats;
    }
}