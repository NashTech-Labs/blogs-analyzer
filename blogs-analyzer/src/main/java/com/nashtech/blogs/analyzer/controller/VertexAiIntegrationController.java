package com.nashtech.blogs.analyzer.controller;

import com.google.cloud.vertexai.api.Content;
import com.google.cloud.vertexai.api.GenerateContentResponse;
import com.google.cloud.vertexai.generativeai.ChatSession;
import com.google.cloud.vertexai.generativeai.ResponseHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/vertex/v1")
@RequiredArgsConstructor
public class VertexAiIntegrationController {

    private final ChatSession chatSession;

    @PostMapping("/review")
    public String fromBodyPost(@RequestBody String prompt) throws IOException {
        GenerateContentResponse generateContentResponse = this.chatSession.sendMessage(prompt);
        return ResponseHandler.getText(generateContentResponse);
    }

    @GetMapping("/history/{text}")
    public List<String> getChatSessionHistory(@PathVariable String text) throws IOException {
        GenerateContentResponse generateContentResponse = this.chatSession.sendMessage(text);
        List<Content> history = this.chatSession.getHistory();
        return history.stream().flatMap(h -> h.getPartsList().stream()).map(part -> part.getText()).toList();
    }


}
