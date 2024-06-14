package com.nashtech.blogs.analyzer.controller;

import com.nashtech.blogs.analyzer.model.Post;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wordpress")
public class WordPressController {

    @Autowired
    private RestTemplate restTemplate;

    private final String WORDPRESS_API_BASE_URL = "https://blog.nashtechglobal.com/wp-json/wp/v2/";

    @GetMapping("/posts/{id}")
    public ResponseEntity<String> getPostById(@PathVariable Long id) {
        String url = WORDPRESS_API_BASE_URL + "posts/" + id;
        String response = restTemplate.getForObject(url, String.class);

        JSONObject jsonResponse = new JSONObject(response);
        String content = jsonResponse.getJSONObject("content").getString("rendered");

        return ResponseEntity.ok(content);
    }

    @GetMapping("/posts")
    public ResponseEntity<String> searchPosts(@RequestParam(value = "search", required = false) String search) {
        String url = WORDPRESS_API_BASE_URL + "posts?search=" + search;
        String response = restTemplate.getForObject(url, String.class);
        JSONArray postsArray = new JSONArray(response);
        StringBuilder renderedContent = new StringBuilder();

        for (int i = 0; i < postsArray.length(); i++) {
            JSONObject post = postsArray.getJSONObject(i);
            String content = post.getJSONObject("content").getString("rendered");
            renderedContent.append(content).append("\n");
        }

        return ResponseEntity.ok(renderedContent.toString());
    }

    @GetMapping("/posts-by-title")
    public ResponseEntity<String> searchPostsByTitle(@RequestParam String title) {
        String url = WORDPRESS_API_BASE_URL + "posts?search=" + title + "&searchFields=title";
        String response = restTemplate.getForObject(url, String.class);
        JSONArray postsArray = new JSONArray(response);
        StringBuilder renderedContent = new StringBuilder();

        for (int i = 0; i < postsArray.length(); i++) {
            JSONObject post = postsArray.getJSONObject(i);
            String content = post.getJSONObject("content").getString("rendered");
            renderedContent.append(content).append("\n");
        }

        return ResponseEntity.ok(renderedContent.toString());
    }

//    @GetMapping("/posts/drafts")
//    public ResponseEntity<String> getDraftPosts() {
//        String url = WORDPRESS_API_BASE_URL + "posts?status=draft";
//        String response = restTemplate.getForObject(url, String.class);
//        return ResponseEntity.ok(response);
//    }

    @GetMapping
    public ResponseEntity<List<Post>> getAllPosts() {
        String url = WORDPRESS_API_BASE_URL + "posts";
        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {
                }
        );

        List<Map<String, Object>> postMaps = response.getBody();
        List<Post> posts = new ArrayList<>();

        if (postMaps != null) {
            for (Map<String, Object> postMap : postMaps) {
                Post post = new Post();
                post.setId(((Number) postMap.get("id")).longValue());

                Map<String, Object> titleMap = (Map<String, Object>) postMap.get("title");
                Post.Title title = new Post.Title();
                title.setRendered((String) titleMap.get("rendered"));
                post.setTitle(title);

                post.setUrl(WORDPRESS_API_BASE_URL + "posts/" + post.getId());
                post.setStatus((String) postMap.get("status"));

                posts.add(post);
            }
        }

        return ResponseEntity.ok(posts);
    }
}
