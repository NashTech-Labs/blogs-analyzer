package com.nashtech.blogs.analyzer.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nashtech.blogs.analyzer.model.OutgoingRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.io.IOException;

@RestController
@RequestMapping("/api/gemini/v1")
@RequiredArgsConstructor
public class GeminiController {

    private static final Logger logger = LoggerFactory.getLogger(GeminiController.class);

    @Autowired
    private RestTemplate restTemplate;

    @Autowired
    ObjectMapper objectMapper;
    
    @Value("${spring.ai.vertex.ai.gemini.google-native-api-base-url}")
    private String GOOGLE_API_BASE_URL;

    @Value("${spring.ai.vertex.ai.gemini.google-native-api-key}")
    private String GOOGLE_GEMINI_API_KEY;

    @Value("${spring.ai.vertex.ai.gemini.google-native-api-geminiModel}")
    private String GOOGLE_NATIVE_GEMINI_MODEL;

    @PostMapping("/review")
    public ResponseEntity<String> fromGoogleNativeAPIForGemini(@RequestBody String text) throws IOException {
        logger.info("Received request to generate content from Google Native API.");

        String url = GOOGLE_API_BASE_URL + "/v1beta/models/" + GOOGLE_NATIVE_GEMINI_MODEL + ":generateContent?key=" + GOOGLE_GEMINI_API_KEY;
        logger.debug("Generated URL: {}", url);

        OutgoingRequest requestBody = createRequestBody(text);
        logger.debug("Created OutgoingRequest body: {}", requestBody);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        HttpEntity<OutgoingRequest> requestEntity = new HttpEntity<>(requestBody, headers);
        logger.debug("Created HTTP entity: {}", requestEntity);

        String response = restTemplate.postForObject(url, requestEntity, String.class);
        logger.debug("Received response from Google Native API: {}", response);

        String extractedText = extractTextFromResponse(response);
        logger.info("Extracted text from response.");

        return ResponseEntity.ok(extractedText);
    }

    public OutgoingRequest createRequestBody(String text) {
        logger.debug("Creating request body for text: {}", text);
        OutgoingRequest requestBody = new OutgoingRequest();
        OutgoingRequest.Content content = new OutgoingRequest.Content();
        OutgoingRequest.Content.Part part = new OutgoingRequest.Content.Part();
        part.setText(text);
        content.setParts(new OutgoingRequest.Content.Part[]{part});
        requestBody.setContents(new OutgoingRequest.Content[]{content});
        logger.debug("Created request body: {}", requestBody);
        return requestBody;
    }

    public String extractTextFromResponse(String response) throws IOException {
        ObjectMapper objectMapper = new ObjectMapper();
        logger.debug("Extracting text from response: {}", response);
        JsonNode rootNode = objectMapper.readTree(response);
        String extractedText = rootNode.path("candidates")
                .get(0)
                .path("content")
                .path("parts")
                .get(0)
                .path("text")
                .asText();
        logger.debug("Extracted text: {}", extractedText);
        return extractedText;
    }
}
