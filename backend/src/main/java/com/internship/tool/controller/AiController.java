package com.internship.tool.controller;

import com.internship.tool.service.AiServiceClient;

import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.SERVICE_UNAVAILABLE;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AiController {

    private final AiServiceClient aiServiceClient;

    public AiController(AiServiceClient aiServiceClient) {
        this.aiServiceClient = aiServiceClient;
    }

    @PostMapping("/recommend")
    public Map<String, String> recommend(@RequestBody Map<String, String> request) {
        String inputText = getAiInput(request);
        String recommendations = aiServiceClient.getRecommendations(inputText);

        if (recommendations == null || recommendations.isBlank()) {
            throw new ResponseStatusException(SERVICE_UNAVAILABLE, "AI service unavailable");
        }

        return Map.of("insight", recommendations);
    }

    @PostMapping("/describe")
    public Map<String, String> describe(@RequestBody Map<String, String> request) {
        String inputText = getAiInput(request);
        String insight = aiServiceClient.getInsight(inputText);

        if (insight == null || insight.isBlank()) {
            throw new ResponseStatusException(SERVICE_UNAVAILABLE, "AI service unavailable");
        }

        return Map.of("insight", insight);
    }

    @PostMapping("/report")
    public Map<String, String> report(@RequestBody Map<String, String> request) {
        String inputText = getAiInput(request);
        String report = aiServiceClient.generateReport(inputText);

        if (report == null || report.isBlank()) {
            throw new ResponseStatusException(SERVICE_UNAVAILABLE, "AI service unavailable");
        }

        return Map.of("report", report);
    }

    private String getAiInput(Map<String, String> request) {
        String inputText = firstPresent(
                request.get("description"),
                request.get("inputText"),
                request.get("companyName")
        );

        if (inputText == null || inputText.isBlank()) {
            throw new ResponseStatusException(BAD_REQUEST, "description or companyName is required");
        }

        return inputText;
    }

    private String firstPresent(String... values) {
        for (String value : values) {
            if (value != null && !value.isBlank()) {
                return value;
            }
        }

        return null;
    }
}
