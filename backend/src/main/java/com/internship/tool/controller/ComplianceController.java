package com.internship.tool.controller;

import com.internship.tool.entity.ComplianceRecord;
import com.internship.tool.repository.ComplianceRepository;
import com.internship.tool.service.AiServiceClient;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import java.io.IOException;
import java.io.PrintWriter;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "http://localhost:5173")
public class ComplianceController {

    private static final long MAX_UPLOAD_BYTES = 2 * 1024 * 1024;
    private static final List<String> ALLOWED_UPLOAD_TYPES = List.of(
            "text/csv",
            "application/vnd.ms-excel",
            "text/plain"
    );

    private final ComplianceRepository repository;
    private final AiServiceClient aiServiceClient;

    public ComplianceController(ComplianceRepository repository, AiServiceClient aiServiceClient) {
        this.repository = repository;
        this.aiServiceClient = aiServiceClient;
    }

    @GetMapping("/all")
    public List<ComplianceRecord> getAll() {
        return repository.findByDeletedFalseOrderByCreatedAtDesc();
    }

    @GetMapping("/export")
    public void exportCSV(HttpServletResponse response) throws IOException {
        response.setContentType("text/csv");
        response.setHeader("Content-Disposition", "attachment; filename=records.csv");

        PrintWriter writer = response.getWriter();
        writer.println("ID,Company,Score,Status,Description,Created At");

        for (ComplianceRecord record : repository.findByDeletedFalseOrderByCreatedAtDesc()) {
            writer.println(String.join(",",
                    csv(record.getId()),
                    csv(record.getCompanyName()),
                    csv(record.getComplianceScore()),
                    csv(record.getStatus()),
                    csv(record.getDescription()),
                    csv(record.getCreatedAt())
            ));
        }

        writer.flush();
    }

    @GetMapping("/{id}")
    public ComplianceRecord getById(@PathVariable Long id) {
        return findActiveRecord(id);
    }

    @PostMapping("/create")
    public ResponseEntity<ComplianceRecord> create(@Valid @RequestBody ComplianceRecord record) {
        record.setId(null);
        record.setDeleted(false);
        return ResponseEntity.status(HttpStatus.CREATED).body(repository.save(record));
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> uploadFile(@RequestParam("file") MultipartFile file) {
        validateUpload(file);

        return ResponseEntity.ok(Map.of(
                "message", "File uploaded successfully",
                "filename", file.getOriginalFilename(),
                "size", file.getSize()
        ));
    }

    @PutMapping("/{id}")
    public ComplianceRecord update(@PathVariable Long id, @Valid @RequestBody ComplianceRecord updated) {
        ComplianceRecord existing = findActiveRecord(id);

        existing.setCompanyName(updated.getCompanyName());
        existing.setComplianceScore(updated.getComplianceScore());
        existing.setStatus(updated.getStatus());
        existing.setDescription(updated.getDescription());

        return repository.save(existing);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        ComplianceRecord existing = findActiveRecord(id);
        existing.setDeleted(true);
        repository.save(existing);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/search")
    public List<ComplianceRecord> search(
            @RequestParam(required = false) String q,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate from,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate to) {
        String normalizedQuery = normalize(q);
        String normalizedStatus = normalize(status);
        var fromDateTime = from == null ? null : from.atStartOfDay();
        var toDateTime = to == null ? null : to.atTime(LocalTime.MAX);

        Stream<ComplianceRecord> records = repository.findByDeletedFalseOrderByCreatedAtDesc().stream();

        if (normalizedQuery != null) {
            records = records.filter(record ->
                    record.getCompanyName() != null
                            && record.getCompanyName().toLowerCase().contains(normalizedQuery.toLowerCase()));
        }

        if (normalizedStatus != null) {
            records = records.filter(record ->
                    record.getStatus() != null
                            && record.getStatus().equalsIgnoreCase(normalizedStatus));
        }

        if (fromDateTime != null) {
            records = records.filter(record ->
                    record.getCreatedAt() != null && !record.getCreatedAt().isBefore(fromDateTime));
        }

        if (toDateTime != null) {
            records = records.filter(record ->
                    record.getCreatedAt() != null && !record.getCreatedAt().isAfter(toDateTime));
        }

        return records.toList();
    }

    @GetMapping("/status/{status}")
    public List<ComplianceRecord> filterByStatus(@PathVariable String status) {
        return repository.findByStatusIgnoreCaseAndDeletedFalseOrderByCreatedAtDesc(status);
    }

    @PostMapping("/ai")
    public Map<String, Object> getAI(@RequestBody Map<String, String> request) {
        String input = request.get("inputText");

        if (input == null || input.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "inputText is required");
        }

        Map<String, Object> result = aiServiceClient.getDescription(input);

        if (result == null) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE, "AI service failed");
        }

        return result;
    }

    private ComplianceRecord findActiveRecord(Long id) {
        ComplianceRecord record = repository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Record not found"));

        if (Boolean.TRUE.equals(record.getDeleted())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Record not found");
        }

        return record;
    }

    private void validateUpload(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Upload file is required");
        }

        if (file.getSize() > MAX_UPLOAD_BYTES) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "Upload must be 2 MB or smaller");
        }

        String filename = file.getOriginalFilename() == null ? "" : file.getOriginalFilename().toLowerCase();
        String contentType = file.getContentType();

        if (!filename.endsWith(".csv") || contentType == null || !ALLOWED_UPLOAD_TYPES.contains(contentType)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Only CSV uploads are allowed");
        }
    }

    private String normalize(String value) {
        if (value == null || value.isBlank()) {
            return null;
        }

        return value.trim();
    }

    private String csv(Object value) {
        String text = value == null ? "" : String.valueOf(value);
        return "\"" + text.replace("\"", "\"\"") + "\"";
    }
}
