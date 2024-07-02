package com.nashtech.blogs.analyzer.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.nashtech.blogs.analyzer.model.OutgoingRequest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.client.RestTemplate;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

@ExtendWith(SpringExtension.class)
@SpringBootTest(classes = {GeminiController.class})
class GeminiControllerTest {

    private MockMvc mockMvc;

    @Autowired
    private GeminiController geminiController;

    @MockBean
    private RestTemplate restTemplate;

    @MockBean
    private ObjectMapper objectMapper;

    @BeforeEach
    public void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(geminiController).build();
    }

    @Test
    void testFromGoogleNativeAPIForGemini_Success() throws Exception {
        String sampleText = "Sample text";
        String response = "{\"candidates\":[{\"content\":{\"parts\":[{\"text\":\"Extracted text\"}]}}]}";

        when(restTemplate.postForObject(any(String.class), any(), any(Class.class)))
                .thenReturn(response);

        when(objectMapper.readTree(any(String.class)))
                .thenReturn(new ObjectMapper().readTree(response));

        mockMvc.perform(MockMvcRequestBuilders.post("/api/gemini/v1/review")
                        .content(sampleText)
                        .contentType(MediaType.APPLICATION_JSON))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("Extracted text"));
    }

    @Test
    void testCreateRequestBody() {
        String text = "Sample text";
        OutgoingRequest requestBody = geminiController.createRequestBody(text);

        assert requestBody.getContents().length == 1;
        assert requestBody.getContents()[0].getParts().length == 1;
        assert "Sample text".equals(requestBody.getContents()[0].getParts()[0].getText());
    }

    @Test
    void testExtractTextFromResponse() throws Exception {
        String response = "{\"candidates\":[{\"content\":{\"parts\":[{\"text\":\"Extracted text\"}]}}]}";

        String extractedText = geminiController.extractTextFromResponse(response);

        assert "Extracted text".equals(extractedText);
    }
}

