package com.nashtech.blogs.analyzer.controller;


import com.google.cloud.vertexai.api.GenerateContentResponse;
import com.google.cloud.vertexai.generativeai.ChatSession;
import com.google.cloud.vertexai.generativeai.ResponseHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/gemini")
@RequiredArgsConstructor
public class GeminiController {
    private final ChatSession chatSession;

    @PostMapping("/v1/review")
    public String fromBodyPost(@RequestBody String prompt) throws IOException {
        GenerateContentResponse generateContentResponse = this.chatSession.sendMessage(prompt);
        return ResponseHandler.getText(generateContentResponse);
    }
}
