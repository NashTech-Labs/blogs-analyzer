package com.nashtech.blogs.analyzer.config;

import com.google.cloud.vertexai.VertexAI;
import com.google.cloud.vertexai.generativeai.ChatSession;
import com.google.cloud.vertexai.generativeai.GenerativeModel;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.context.annotation.SessionScope;

import java.io.IOException;

@Configuration(proxyBeanMethods = false)
public class GeminiConfiguration {
    
    @Value("${spring.ai.vertex.ai.gemini.project-id}")
    private String projectId;

    @Value("${spring.ai.vertex.ai.gemini.location}")
    private String location;

    @Value("${spring.ai.vertex.ai.gemini.modelName}")
    private String modelName;
    

    @Bean
    public VertexAI vertexAI() throws IOException {
        return new VertexAI(projectId, location);
    }

    @Bean
    public GenerativeModel geminiProVisionGenerativeModel(VertexAI vertexAI) {
        return new GenerativeModel(modelName, vertexAI);
    }

    @Bean
    @SessionScope
    public ChatSession chatSession(@Qualifier("geminiProVisionGenerativeModel") GenerativeModel generativeModel) {
        return new ChatSession(generativeModel);
    }
}