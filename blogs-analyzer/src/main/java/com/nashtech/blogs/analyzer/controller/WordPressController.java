package com.nashtech.blogs.analyzer.controller;

import com.nashtech.blogs.analyzer.exception.PostNotFoundException;
import com.nashtech.blogs.analyzer.model.Post;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/wordpress")
public class WordPressController {

    @Autowired
    private RestTemplate restTemplate;

    @Value("${wordpress.api.base-url}")
    private String WORDPRESS_API_BASE_URL;

    @GetMapping("/posts/{id}")
    public ResponseEntity<String> getPostById(@PathVariable Long id) {
        String url = WORDPRESS_API_BASE_URL + "posts/" + id;
        String response = restTemplate.getForObject(url, String.class);
        if (response == null || response.isEmpty()) {
            throw new PostNotFoundException("Post with ID " + id + " not found");
        }

        JSONObject jsonResponse = new JSONObject(response);
        String content = jsonResponse.getJSONObject("content").getString("rendered");

        return ResponseEntity.ok(content);
    }

    @GetMapping("/posts")
    public ResponseEntity<String> searchPosts(@RequestParam(value = "search", required = false) String search) {
        String url = WORDPRESS_API_BASE_URL + "posts?search=" + search;
        String response = restTemplate.getForObject(url, String.class);
        JSONArray postsArray = new JSONArray(response);
        if (postsArray.isEmpty()) {
            throw new PostNotFoundException("No posts found with the search term: " + search);
        }
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
        if (postsArray.isEmpty()) {
            throw new PostNotFoundException("No posts found with the title: " + title);
        }
        StringBuilder renderedContent = new StringBuilder();

        for (int i = 0; i < postsArray.length(); i++) {
            JSONObject post = postsArray.getJSONObject(i);
            String content = post.getJSONObject("content").getString("rendered");
            renderedContent.append(content).append("\n");
        }

        return ResponseEntity.ok(renderedContent.toString());
    }

    @GetMapping("/posts-by-author")
    public ResponseEntity<String> getPostsByAuthorId(@RequestParam String authorId) {
        if (authorId == null || authorId.isBlank()) {
            return ResponseEntity.badRequest().body("Author ID must not be null or empty");
        }

        int page = 1;
        int totalPages = 1;
        boolean postFound = false;

        StringBuilder renderedContent = new StringBuilder();

        while (page <= totalPages) {
            String url = WORDPRESS_API_BASE_URL + "posts?page=" + page + "&author=" + authorId;
            String response = restTemplate.getForObject(url, String.class);
            JSONArray postsArray = new JSONArray(response);

            if (page == 1) {
                totalPages = Integer.parseInt(Objects.requireNonNull(restTemplate.headForHeaders(url).getFirst("X-WP-TotalPages")));
            }

            for (int i = 0; i < postsArray.length(); i++) {
                postFound = true;
                JSONObject post = postsArray.getJSONObject(i);
                String postId = post.get("id").toString();
                String title = post.getJSONObject("title").getString("rendered");
                String content = post.getJSONObject("content").getString("rendered");

                renderedContent.append("Post ID: ").append(postId).append("\n");
                renderedContent.append("Title: ").append(title).append("\n");
                renderedContent.append("Content:\n").append(content).append("\n\n");
            }
            page++;
        }
        if (!postFound) {
            throw new PostNotFoundException("No posts found for author ID: " + authorId);
        }
        return ResponseEntity.ok(renderedContent.toString());
    }


    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPosts(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        String url = WORDPRESS_API_BASE_URL + "posts?page=" + page + "&per_page=" + size;
        ResponseEntity<List<Map<String, Object>>> response = restTemplate.exchange(
                url,
                HttpMethod.GET,
                null,
                new ParameterizedTypeReference<>() {
                }
        );

        List<Map<String, Object>> postMaps = response.getBody();
        if (postMaps == null || postMaps.isEmpty()) {
            throw new PostNotFoundException("No posts found for the given page: " + page);
        }
        List<Post> posts = new ArrayList<>();


            for (Map<String, Object> postMap : postMaps) {
                Post post = new Post();
                post.setId(((Number) postMap.get("id")).longValue());

                Map<String, Object> titleMap = (Map<String, Object>) postMap.get("title");
                Post.Title title = new Post.Title();
                title.setRendered((String) titleMap.get("rendered"));
                post.setTitle(title);

                String postUrl = (String) postMap.getOrDefault("link", ((Map<String, Object>) postMap.get("guid")).get("rendered"));
                post.setUrl(postUrl);
                post.setStatus((String) postMap.get("status"));

                post.setAuthorId(((Number) postMap.get("author")).longValue());

                posts.add(post);
            }

            fetchAuthorNames(posts);


        HttpHeaders headers = response.getHeaders();
        int totalPosts = Integer.parseInt(Objects.requireNonNull(headers.getFirst("X-WP-Total")));
        int totalPages = (int) Math.ceil((double) totalPosts / size);

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("posts", posts);
        responseBody.put("totalPages", totalPages);

        return ResponseEntity.ok(responseBody);
    }

    private void fetchAuthorNames(List<Post> posts) {
        Set<Long> authorIds = posts.stream().map(Post::getAuthorId).collect(Collectors.toSet());
        Map<Long, String> authorMap = new HashMap<>();

        for (Long authorId : authorIds) {
            String authorUrl = WORDPRESS_API_BASE_URL + "users/" + authorId;
            ResponseEntity<Map<String, Object>> authorResponse = restTemplate.exchange(
                    authorUrl,
                    HttpMethod.GET,
                    null,
                    new ParameterizedTypeReference<>() {
                    }
            );

            Map<String, Object> authorMapResponse = authorResponse.getBody();
            if (authorMapResponse != null) {
                String authorName = (String) authorMapResponse.get("name");
                authorMap.put(authorId, authorName);
            }
        }

        for (Post post : posts) {
            if (authorMap.containsKey(post.getAuthorId())) {
                post.setAuthorName(authorMap.get(post.getAuthorId()));
            }
        }
    }
}
