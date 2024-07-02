package com.nashtech.blogs.analyzer.controller;

import com.google.cloud.vertexai.generativeai.ChatSession;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.io.IOException;
import java.util.Collections;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class VertexAiIntegrationControllerTest {

    @Mock
    private ChatSession mockChatSession;

    private VertexAiIntegrationController vertexAiIntegrationControllerUnderTest;

    @BeforeEach
    void setUp() {
        vertexAiIntegrationControllerUnderTest = new VertexAiIntegrationController(mockChatSession);
    }

    @Test
    void testFromBodyPost_ChatSessionThrowsIOException() throws Exception {
        when(mockChatSession.sendMessage("prompt")).thenThrow(IOException.class);
        assertThrows(IOException.class, () -> vertexAiIntegrationControllerUnderTest.fromBodyPost("prompt"));
    }

    @Test
    void testGetChatSessionHistory_ChatSessionSendMessageThrowsIOException() throws Exception {
        when(mockChatSession.sendMessage("text")).thenThrow(IOException.class);
        assertThrows(IOException.class, () -> vertexAiIntegrationControllerUnderTest.getChatSessionHistory("text"));
    }

    @Test
    void testGetChatSessionHistory_ChatSessionGetHistoryReturnsNoItems() throws Exception {
        when(mockChatSession.getHistory()).thenReturn(Collections.emptyList());
        final List<String> result = vertexAiIntegrationControllerUnderTest.getChatSessionHistory("text");
        assertEquals(Collections.emptyList(), result);
        verify(mockChatSession).sendMessage("text");
    }
}

