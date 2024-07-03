package com.nashtech.blogs.analyzer.controller;

import com.nashtech.blogs.analyzer.exception.PostNotFoundException;
import com.nashtech.blogs.analyzer.model.Post;
import org.json.JSONArray;
import org.json.JSONObject;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
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

    private static final Logger logger = LoggerFactory.getLogger(WordPressController.class);

    @Value("${wordpress.api.base-url}")
    public String WORDPRESS_API_BASE_URL;

    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/posts/{id}")
    public ResponseEntity<String> getPostById(@PathVariable Long id) {
        logger.info("Fetching post with ID: {}", id);
        String url = WORDPRESS_API_BASE_URL + "posts/" + id;
        String response = restTemplate.getForObject(url, String.class);
        if (response == null || response.isEmpty()) {
            logger.error("Post with ID {} not found", id);
            throw new PostNotFoundException("Post with ID " + id + " not found");
        }

        JSONObject jsonResponse = new JSONObject(response);
        String content = jsonResponse.getJSONObject("content").getString("rendered");
        logger.info("Successfully fetched post with ID: {}", id);

        return ResponseEntity.ok(content);
    }

    @GetMapping("/posts-by-title")
    public ResponseEntity<String> searchPostsByTitle(@RequestParam String title) {
        logger.info("Searching posts by specific title.");
        String url = WORDPRESS_API_BASE_URL + "posts?search=" + title + "&searchFields=title";
        String response = restTemplate.getForObject(url, String.class);
        JSONArray postsArray = new JSONArray(response);
        if (postsArray.isEmpty()) {
            logger.error("No posts found with this title");
            throw new PostNotFoundException("No posts found with the title: " + title);
        }
        StringBuilder renderedContent = new StringBuilder();

        for (int i = 0; i < postsArray.length(); i++) {
            JSONObject post = postsArray.getJSONObject(i);
            String content = post.getJSONObject("content").getString("rendered");
            renderedContent.append(content).append("\n");
        }
        logger.info("Successfully fetched posts by specific title.");

        return ResponseEntity.ok(renderedContent.toString());
    }

    @GetMapping("/posts-by-author")
    public ResponseEntity<String> getPostsByAuthorId(@RequestParam String authorId) {
        logger.info("Fetching posts by author ID");
        if (authorId == null || authorId.isBlank()) {
            logger.error("Author ID must not be null or empty");
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
            logger.error("No posts found for this author ID.");
            throw new PostNotFoundException("No posts found for author ID: " + authorId);
        }
        logger.info("Successfully fetched posts for author ID.");
        return ResponseEntity.ok(renderedContent.toString());
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getAllPosts(
            @RequestParam(value = "page", defaultValue = "1") int page,
            @RequestParam(value = "size", defaultValue = "10") int size
    ) {
        logger.info("Fetching all posts for page: {} with size: {}", page, size);
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
            logger.error("No posts found for the given page: {}", page);
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

        logger.info("Successfully fetched all posts for page: {} with size: {}", page, size);
        return ResponseEntity.ok(responseBody);
    }

    private void fetchAuthorNames(List<Post> posts) {
        logger.info("Fetching author names for posts");
        if (posts == null) {
            logger.error("Posts list cannot be null");
            throw new IllegalArgumentException("Posts list cannot be null");
        }
        Set<Long> authorIds = posts.stream().map(Post::getAuthorId).collect(Collectors.toSet());
        Map<Long, String> authorMap = new HashMap<>();

        for (Long authorId : authorIds) {
            String authorUrl = WORDPRESS_API_BASE_URL + "users/" + authorId;
            ResponseEntity<Map<String, Object>> authorResponse = restTemplate.exchange(
                    authorUrl,
                    HttpMethod.GET, null,
                    new ParameterizedTypeReference<>() {
                    }
            );
            if (authorResponse != null) {
                Map<String, Object> authorMapResponse = authorResponse.getBody();
                String authorName = (String) authorMapResponse.get("name");
                authorMap.put(authorId, authorName);
            }
        }

        for (Post post : posts) {
            if (post != null && authorMap.containsKey(post.getAuthorId())) {
                post.setAuthorName(authorMap.get(post.getAuthorId()));
            }
        }
        logger.info("Successfully fetched author names for posts");
    }
}
