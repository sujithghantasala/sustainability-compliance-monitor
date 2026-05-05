package com.internship.tool.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import com.internship.tool.entity.ComplianceRecord;
import com.internship.tool.repository.ComplianceRepository;
import com.internship.tool.service.AuditService;
import com.internship.tool.service.AiServiceClient;

import jakarta.servlet.http.HttpServletResponse;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin
public class ComplianceController {

    @Autowired
    private ComplianceRepository repository;

    @Autowired
    private AuditService auditService;

    @Autowired
    private AiServiceClient aiServiceClient;

    // 🔹 GET ALL
    @GetMapping("/all")
    public List<ComplianceRecord> getAll() {
        return repository.findAll();
    }

    // 🔹 EXPORT CSV
    @GetMapping("/export")
    public void exportCSV(HttpServletResponse response) throws IOException {

        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=records.csv");

        List<ComplianceRecord> list = repository.findAll();

        PrintWriter writer = response.getWriter();

        writer.println("ID,Company,Score,Status,Description");

        for (ComplianceRecord r : list) {
            writer.println(
                    r.getId() + "," +
                    r.getCompanyName() + "," +
                    r.getComplianceScore() + "," +
                    r.getStatus() + "," +
                    r.getDescription()
            );
        }

        writer.flush();
    }

    // 🔹 GET BY ID
    @GetMapping("/{id}")
    public ComplianceRecord getById(@PathVariable Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));
    }

    // 🔹 CREATE
    @PostMapping("/create")
    public ComplianceRecord create(@RequestBody ComplianceRecord record) {
        System.out.println("CREATE API HIT");
        return repository.save(record);
    }

    // 🔹 FILE UPLOAD
    @PostMapping(value = "/upload", consumes = "multipart/form-data")
    public String uploadFile(@RequestParam("file") MultipartFile file) {
        System.out.println("UPLOAD API HIT");
        return "File uploaded successfully";
    }

    // 🔹 UPDATE
    @PutMapping("/{id}")
    public ComplianceRecord update(@PathVariable Long id, @RequestBody ComplianceRecord updated) {

        ComplianceRecord existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Record not found"));

        existing.setCompanyName(updated.getCompanyName());
        existing.setComplianceScore(updated.getComplianceScore());
        existing.setStatus(updated.getStatus());
        existing.setDescription(updated.getDescription());

        return repository.save(existing);
    }

    // 🔹 DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repository.deleteById(id);
    }

    // 🔹 SEARCH
    @GetMapping("/search")
    public List<ComplianceRecord> search(@RequestParam String q) {
        return repository.findByCompanyNameContainingIgnoreCase(q);
    }

    // 🔹 FILTER
    @GetMapping("/status/{status}")
    public List<ComplianceRecord> filterByStatus(@PathVariable String status) {
        return repository.findByStatus(status);
    }


    @PostMapping("/ai")
    public Map<String, Object> getAI(@RequestBody Map<String, String> request) {

        System.out.println("AI API HIT");

        String input = request.get("inputText");

        if (input == null || input.isEmpty()) {
            throw new RuntimeException("inputText is required");
        }

        Map<String, Object> result = aiServiceClient.getDescription(input);

        if (result == null) {
            throw new RuntimeException("AI service failed");
        }

        return result;
    }
}