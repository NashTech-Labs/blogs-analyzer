package com.nashtech.blogs.analyzer.config;

import com.google.cloud.vertexai.VertexAI;
import com.google.cloud.vertexai.generativeai.ChatSession;
import com.google.cloud.vertexai.generativeai.GenerativeModel;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.annotation.SessionScope;

import java.io.IOException;

@Configuration(proxyBeanMethods = false)
public class GeminiConfiguration {

    @Bean
    public VertexAI vertexAI() throws IOException {
        return new VertexAI("gen-lang-client-0999974873", "asia-south1");
    }

    @Bean
    public GenerativeModel geminiProVisionGenerativeModel(VertexAI vertexAI) {
        return new GenerativeModel("gemini-1.0-pro-vision-001", vertexAI);
    }

    @Bean
    public GenerativeModel geminiProGenerativeModel(VertexAI vertexAI) {
        return new GenerativeModel("gemini-1.0-pro-vision-001", vertexAI);
    }

    @Bean
    @SessionScope
    public ChatSession chatSession(@Qualifier("geminiProGenerativeModel") GenerativeModel generativeModel) {
        return new ChatSession(generativeModel);
    }
}