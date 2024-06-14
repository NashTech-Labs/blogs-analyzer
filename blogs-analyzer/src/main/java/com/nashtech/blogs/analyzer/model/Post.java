package com.nashtech.blogs.analyzer.model;

import lombok.Data;

@Data
public class Post {
    private Long id;
    private Title title;
    private String url;
    private String status;

    @Data
    public static class Title {
        private String rendered;
    }
}
