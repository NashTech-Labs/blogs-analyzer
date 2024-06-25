package com.nashtech.blogs.analyzer.controller;


import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.cloud.vertexai.api.Content;
import com.google.cloud.vertexai.api.GenerateContentResponse;
import com.google.cloud.vertexai.generativeai.ChatSession;
import com.google.cloud.vertexai.generativeai.ResponseHandler;
import com.nashtech.blogs.analyzer.model.OutgoingRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import java.io.IOException;
import java.util.List;


@RestController
@RequestMapping("/api/gemini")
@RequiredArgsConstructor
public class GeminiController {
    private final ChatSession chatSession;

    @Autowired
    private RestTemplate restTemplate;

    @Value("${spring.ai.vertex.ai.gemini.google-native-api-base-url}")
    private String GOOGLE_API_BASE_URL;

    @Value("${spring.ai.vertex.ai.gemini.google-native-api-key}")
    private String GOOGLE_GEMINI_API_KEY;


    @PostMapping("/v1/review")
    public String fromBodyPost(@RequestBody String prompt) throws IOException {
        GenerateContentResponse generateContentResponse = this.chatSession.sendMessage(prompt);
        return ResponseHandler.getText(generateContentResponse);
    }

    @GetMapping("/v1/history/{text}")
    public List<String> getChatSessionHistory(@PathVariable String text) throws IOException {
        GenerateContentResponse generateContentResponse = this.chatSession.sendMessage(text);
        List<Content> history = this.chatSession.getHistory();
        return history.stream().flatMap(h -> h.getPartsList().stream()).map(part -> part.getText()).toList();
    }

    @PostMapping("/v2/review")
    public ResponseEntity<String> fromGoogleNativeAPIForGemini(@RequestBody String text) throws IOException {

        String url = GOOGLE_API_BASE_URL + "/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + GOOGLE_GEMINI_API_KEY;
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        OutgoingRequest requestBody = new OutgoingRequest();
        OutgoingRequest.Content content = new OutgoingRequest.Content();
        OutgoingRequest.Content.Part part = new OutgoingRequest.Content.Part();
        part.setText(text);
        content.setParts(new OutgoingRequest.Content.Part[]{part});
        requestBody.setContents(new OutgoingRequest.Content[]{content});
        HttpEntity<OutgoingRequest> requestEntity = new HttpEntity<>(requestBody, headers);
        String response = restTemplate.postForObject(url, requestEntity, String.class);
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode rootNode = objectMapper.readTree(response);
        JsonNode candidatesNode = rootNode.path("candidates");
        JsonNode firstCandidate = candidatesNode.get(0);
        JsonNode contentNode = firstCandidate.path("content");
        JsonNode partsNode = contentNode.path("parts");
        JsonNode firstPart = partsNode.get(0);
        String textValue = firstPart.path("text").asText();
        return ResponseEntity.ok(textValue.toString());
    }

}
