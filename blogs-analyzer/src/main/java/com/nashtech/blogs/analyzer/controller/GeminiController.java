package com.nashtech.blogs.analyzer.controller;


import com.google.cloud.vertexai.api.GenerateContentResponse;
import com.google.cloud.vertexai.generativeai.ChatSession;
import com.google.cloud.vertexai.generativeai.ResponseHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;

@RestController
@RequestMapping("/api/gemini")
@RequiredArgsConstructor
public class GeminiController {
    private final ChatSession chatSession;

    @GetMapping("/v1/review")
    public String fromBody(@RequestParam String prompt) throws IOException {
        GenerateContentResponse generateContentResponse = this.chatSession.sendMessage(prompt);
        return ResponseHandler.getText(generateContentResponse);
    }
}
