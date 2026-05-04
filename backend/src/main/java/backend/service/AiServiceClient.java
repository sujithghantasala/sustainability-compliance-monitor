package backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestTemplate;

import java.util.HashMap;
import java.util.Map;

@Component
public class AiServiceClient {

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper = new ObjectMapper();

    // IMPORTANT: match your Flask endpoint
    private final String baseUrl = System.getenv("AI_SERVICE_URL") != null 
            ? System.getenv("AI_SERVICE_URL") 
            : "http://127.0.0.1:5000/describe";

    public AiServiceClient() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(10000);
        factory.setReadTimeout(10000);
        this.restTemplate = new RestTemplate(factory);
    }

    public Map<String, Object> getDescription(String inputText) {
        try {
            System.out.println("Calling AI service...");

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            Map<String, String> requestBody = new HashMap<>();
            requestBody.put("input_text", inputText);

            HttpEntity<Map<String, String>> request =
                    new HttpEntity<>(requestBody, headers);

            @SuppressWarnings("unchecked")
            Map<String, Object> response =
                    restTemplate.postForObject(baseUrl, request, Map.class);

            System.out.println("AI Raw Response: " + response);

            if (response != null && response.get("description") != null) {

                String result = response.get("description").toString();

                // clean markdown
                result = result.replace("```json", "")
                               .replace("```", "")
                               .trim();

                // convert string → JSON object
                return objectMapper.readValue(result, Map.class);
            }

            return null;

        } catch (Exception e) {
            System.err.println("🚨 AI Error: " + e.getMessage());
            return null;
        }
    }
}