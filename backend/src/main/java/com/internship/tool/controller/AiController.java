package com.internship.tool.controller;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AiController {

    @PostMapping("/recommend")
public Map<String, String> recommend(@RequestBody Map<String, String> request) {

    String desc = request.get("description");

    String insight;

    if (desc != null && desc.toLowerCase().contains("pollution")) {
        insight = "Reduce emissions and adopt cleaner processes.";
    } else if (desc != null && desc.toLowerCase().contains("waste")) {
        insight = "Improve waste management and recycling practices.";
    } else {
        insight = "Follow general sustainability best practices.";
    }

    return Map.of("insight", insight);
}
}