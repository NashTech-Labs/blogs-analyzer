package com.nashtech.blogs.analyzer.model;

import lombok.Data;

@Data
public class OutgoingRequest {
    private Content[] contents;

    @Data
    public static class Content {
        private Part[] parts;

        @Data
        public static class Part {
            private String text;

        }
    }
}
 