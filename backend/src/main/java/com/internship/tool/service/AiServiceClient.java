package com.internship.tool.service;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import java.util.Collection;
import java.util.HashMap;
import java.util.Map;
import java.util.StringJoiner;

@Component
public class AiServiceClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    private final String describeUrl;
    private final String serviceRootUrl;

    public AiServiceClient() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);
        factory.setReadTimeout(10000);
        this.restTemplate = new RestTemplate(factory);
        this.serviceRootUrl = resolveServiceRootUrl();
        this.describeUrl = serviceRootUrl + "/describe";
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> describe(String inputText) {
        return postToAiService(describeUrl, inputText);
    }

    public String getInsight(String inputText) {
        return formatResponseText(describe(inputText), "description");
    }

    public String getRecommendations(String inputText) {
        Map<String, Object> response = postToAiService(serviceRootUrl + "/recommend", inputText);
        String recommendations = formatResponseText(response, "recommendations");

        if (recommendations != null && !recommendations.isBlank()) {
            return recommendations;
        }

        return getInsight("Give three practical sustainability recommendations for: " + inputText);
    }

    public String generateReport(String inputText) {
        Map<String, Object> response = postToAiService(serviceRootUrl + "/generate-report", inputText);
        String report = formatResponseText(response, "report");

        if (report != null && !report.isBlank()) {
            return report;
        }

        return getInsight("Generate a sustainability compliance report for: " + inputText);
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getDescription(String inputText) {
        Map<String, Object> response = describe(inputText);

        if (response == null || response.get("description") == null) {
            return null;
        }

        Object description = normalizeValue(response.get("description"));

        if (description instanceof Map<?, ?>) {
            return (Map<String, Object>) description;
        }

        return Map.of("insight", formatValue(description));
    }

    @SuppressWarnings("unchecked")
    private Map<String, Object> postToAiService(String url, String inputText) {
        try {
            System.out.println("Calling AI service at: " + url);

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("input_text", inputText);

            HttpEntity<Map<String, String>> request =
                    new HttpEntity<>(requestBody, headers);

            Map<String, Object> response =
                    restTemplate.postForObject(url, request, Map.class);

            System.out.println("AI Raw Response: " + response);

            return response;

        } catch (RestClientException e) {
            System.err.println("AI Error: " + e.getMessage());
            return null;
        }
    }

    private String formatResponseText(Map<String, Object> response, String responseKey) {
        if (response == null || response.get(responseKey) == null) {
            return null;
        }

        return formatValue(normalizeValue(response.get(responseKey)));
    }

    private String resolveServiceRootUrl() {
        String configuredUrl = System.getenv("AI_SERVICE_URL");

        if (configuredUrl == null || configuredUrl.isBlank()) {
            return "http://127.0.0.1:5000";
        }

        String trimmedUrl = configuredUrl.trim().replaceAll("/+$", "");
        return trimmedUrl.replaceAll("/describe$", "");
    }

    private String formatValue(Object value) {
        if (value instanceof Collection<?> values) {
            return formatCollection(values);
        }

        if (!(value instanceof Map<?, ?> valueMap)) {
            return String.valueOf(value);
        }

        StringJoiner output = new StringJoiner("\n");

        addIfPresent(output, "Summary", valueMap.get("summary"));
        addIfPresent(output, "Impact Level", valueMap.get("impact_level"));
        addIfPresent(output, "Category", valueMap.get("category"));
        addIfPresent(output, "Description", valueMap.get("description"));

        Object keyPoints = valueMap.get("key_points");
        if (keyPoints instanceof Collection<?> points && !points.isEmpty()) {
            output.add("Key Points:");
            for (Object point : points) {
                output.add("- " + point);
            }
        } else {
            addIfPresent(output, "Key Points", keyPoints);
        }

        addFormattedIfPresent(output, "Recommendations", valueMap.get("recommendations"));
        addFormattedIfPresent(output, "Report", valueMap.get("report"));

        String formatted = output.toString();
        return formatted.isBlank() ? valueMap.toString() : formatted;
    }

    private String formatCollection(Collection<?> values) {
        StringJoiner output = new StringJoiner("\n\n");
        int index = 1;

        for (Object value : values) {
            Object normalizedValue = normalizeValue(value);

            if (normalizedValue instanceof Map<?, ?> valueMap) {
                output.add(index + ". " + formatValue(valueMap));
            } else {
                output.add(index + ". " + formatValue(normalizedValue));
            }

            index++;
        }

        return output.toString();
    }

    private void addIfPresent(StringJoiner output, String label, Object value) {
        if (value != null && !String.valueOf(value).isBlank()) {
            output.add(label + ": " + value);
        }
    }

    private void addFormattedIfPresent(StringJoiner output, String label, Object value) {
        if (value != null && !String.valueOf(value).isBlank()) {
            output.add(label + ":\n" + formatValue(normalizeValue(value)));
        }
    }

    private Object normalizeValue(Object value) {
        if (!(value instanceof String text)) {
            return value;
        }

        String cleaned = text
                .replace("```json", "")
                .replace("```", "")
                .trim();

        if (!cleaned.startsWith("{") && !cleaned.startsWith("[")) {
            return cleaned;
        }

        try {
            return objectMapper.readValue(cleaned, Object.class);
        } catch (Exception e) {
            return cleaned;
        }
    }
}
