package com.nashtech.blogs.analyzer.controller;

import com.nashtech.blogs.analyzer.exception.GlobalExceptionHandler;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.ArgumentMatchers.isNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(MockitoExtension.class)
@SpringBootTest
class WordPressControllerTest {

    @Mock
    private RestTemplate restTemplate;

    @InjectMocks
    private WordPressController wordPressController;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders.standaloneSetup(wordPressController)
                .setControllerAdvice(new GlobalExceptionHandler())
                .build();
        wordPressController.WORDPRESS_API_BASE_URL = "https://blog.nashtechglobal.com/wp-json/wp/v2/";
    }

    @Test
    void testGetPostById_Success() throws Exception {
        Long postId = 1L;
        String url = wordPressController.WORDPRESS_API_BASE_URL + "posts/" + postId;
        String jsonResponse = "{\"content\": {\"rendered\": \"<p>Sample Content</p>\"}}";

        when(restTemplate.getForObject(eq(url), eq(String.class))).thenReturn(jsonResponse);

        mockMvc.perform(get("/api/wordpress/posts/{id}", postId))
                .andExpect(status().isOk())
                .andExpect(result -> assertEquals("<p>Sample Content</p>", result.getResponse().getContentAsString()));

        verify(restTemplate, times(1)).getForObject(eq(url), eq(String.class));
    }

    @Test
    void testGetPostById_NotFound() throws Exception {
        Long postId = 1L;
        String url = wordPressController.WORDPRESS_API_BASE_URL + "posts/" + postId;

        when(restTemplate.getForObject(eq(url), eq(String.class))).thenReturn(null);

        mockMvc.perform(get("/api/wordpress/posts/{id}", postId))
                .andExpect(status().isNotFound());

        verify(restTemplate, times(1)).getForObject(eq(url), eq(String.class));
    }

    @Test
    void testSearchPosts_Success() throws Exception {
        String search = "test";
        String url = wordPressController.WORDPRESS_API_BASE_URL + "posts?search=" + search;
        String jsonResponse = "[{\"content\": {\"rendered\": \"<p>Sample Content</p>\"}}]";

        when(restTemplate.getForObject(eq(url), eq(String.class))).thenReturn(jsonResponse);

        mockMvc.perform(get("/api/wordpress/posts").param("search", search))
                .andExpect(status().isOk())
                .andExpect(result -> assertEquals("<p>Sample Content</p>\n", result.getResponse().getContentAsString()));

        verify(restTemplate, times(1)).getForObject(eq(url), eq(String.class));
    }

    @Test
    void testSearchPosts_NotFound() throws Exception {
        String search = "test";
        String url = wordPressController.WORDPRESS_API_BASE_URL + "posts?search=" + search;
        String jsonResponse = "[]";

        when(restTemplate.getForObject(eq(url), eq(String.class))).thenReturn(jsonResponse);

        mockMvc.perform(get("/api/wordpress/posts").param("search", search))
                .andExpect(status().isNotFound());

        verify(restTemplate, times(1)).getForObject(eq(url), eq(String.class));
    }

    @Test
    void testSearchPostsByTitle_Success() throws Exception {
        String title = "test";
        String url = wordPressController.WORDPRESS_API_BASE_URL + "posts?search=" + title + "&searchFields=title";
        String jsonResponse = "[{\"content\": {\"rendered\": \"<p>Sample Content</p>\"}}]";

        when(restTemplate.getForObject(eq(url), eq(String.class))).thenReturn(jsonResponse);

        mockMvc.perform(get("/api/wordpress/posts-by-title").param("title", title))
                .andExpect(status().isOk())
                .andExpect(result -> assertEquals("<p>Sample Content</p>\n", result.getResponse().getContentAsString()));

        verify(restTemplate, times(1)).getForObject(eq(url), eq(String.class));
    }

    @Test
    void testGetPostsByAuthorId_Success() throws Exception {
        String authorId = "1";
        String url = wordPressController.WORDPRESS_API_BASE_URL + "posts?page=1&author=" + authorId;
        String jsonResponse = "[{\"id\": 1, \"title\": {\"rendered\": \"Post Title\"}, \"content\": {\"rendered\": \"<p>Sample Content</p>\"}}]";
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-WP-TotalPages", "1");

        when(restTemplate.getForObject(eq(url), eq(String.class))).thenReturn(jsonResponse);
        when(restTemplate.headForHeaders(eq(url))).thenReturn(headers);

        mockMvc.perform(get("/api/wordpress/posts-by-author").param("authorId", authorId))
                .andExpect(status().isOk())
                .andExpect(result -> assertTrue(result.getResponse().getContentAsString().contains("Post ID: 1")));

        verify(restTemplate, times(1)).getForObject(eq(url), eq(String.class));
        verify(restTemplate, times(1)).headForHeaders(eq(url));
    }

    @Test
    void testGetPostsByAuthorId_NotFound() throws Exception {
        String authorId = "1";
        String url = wordPressController.WORDPRESS_API_BASE_URL + "posts?page=1&author=" + authorId;
        String jsonResponse = "[]";
        HttpHeaders headers = new HttpHeaders();
        headers.add("X-WP-TotalPages", "1");

        when(restTemplate.getForObject(eq(url), eq(String.class))).thenReturn(jsonResponse);
        when(restTemplate.headForHeaders(eq(url))).thenReturn(headers);

        mockMvc.perform(get("/api/wordpress/posts-by-author").param("authorId", authorId))
                .andExpect(status().isNotFound());

        verify(restTemplate, times(1)).getForObject(eq(url), eq(String.class));
        verify(restTemplate, times(1)).headForHeaders(eq(url));
    }

    @Test
    void testGetAllPosts_Success() throws Exception {
        int page = 1;
        int size = 10;
        String url = wordPressController.WORDPRESS_API_BASE_URL + "posts?page=" + page + "&per_page=" + size;
        List<Map<String, Object>> postList = new ArrayList<>();
        Map<String, Object> postMap = new HashMap<>();
        postMap.put("id", 1);
        postMap.put("title", Collections.singletonMap("rendered", "Post Title"));
        postMap.put("link", "https://example.com/post");
        postMap.put("status", "published");
        postMap.put("author", 1);
        postMap.put("guid", Collections.singletonMap("rendered", "https://example.com/post"));
        postList.add(postMap);

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-WP-Total", "1");

        ResponseEntity<List<Map<String, Object>>> responseEntity = new ResponseEntity<>(postList, headers, 200);

        when(restTemplate.exchange(eq(url), eq(HttpMethod.GET), isNull(), any(ParameterizedTypeReference.class)))
                .thenReturn(responseEntity);

        mockMvc.perform(get("/api/wordpress")
                        .param("page", String.valueOf(page))
                        .param("size", String.valueOf(size)))
                .andExpect(status().isOk())
                .andExpect(result -> assertTrue(result.getResponse().getContentAsString().contains("\"totalPages\":1")));

        verify(restTemplate, times(1)).exchange(eq(url), eq(HttpMethod.GET), isNull(), any(ParameterizedTypeReference.class));
    }


    @Test
    void testGetAllPosts_NotFound() throws Exception {
        int page = 1;
        int size = 10;
        String url = wordPressController.WORDPRESS_API_BASE_URL + "posts?page=" + page + "&per_page=" + size;

        HttpHeaders headers = new HttpHeaders();
        headers.add("X-WP-Total", "0");

        ResponseEntity<List<Map<String, Object>>> responseEntity = new ResponseEntity<>(Collections.emptyList(), headers, 200);

        when(restTemplate.exchange(eq(url), eq(HttpMethod.GET), isNull(), any(ParameterizedTypeReference.class)))
                .thenReturn(responseEntity);

        mockMvc.perform(get("/api/wordpress")
                        .param("page", String.valueOf(page))
                        .param("size", String.valueOf(size)))
                .andExpect(status().isNotFound());

        verify(restTemplate, times(1)).exchange(eq(url), eq(HttpMethod.GET), isNull(), any(ParameterizedTypeReference.class));
    }
}

