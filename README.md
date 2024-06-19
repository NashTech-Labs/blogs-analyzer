# blogs-analyzer

## Description

Blogs-Analyzer Backend is a Spring Boot application built to search blogs from WordPress APIs based on username, blog ID, or text. Additionally, it integrates with Vertex AI for analyzing the quality of a particular blog post using machine learning capabilities.

## Table of Contents

- [Description](#description)
- [Setup Instructions](#setup-instructions)
- [Dependencies](#dependencies)
- [Endpoints](#endpoints)
- [Running the Application](#running-the-application)

## Setup Instructions

To set up and run the Blogs-Analyzer Backend locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NashTech-Labs/Blogs-Analyzer.git
   cd blogs-analyzer

## Ensure Java 21 (or compatible version) is installed.

## Install Maven (if not already installed):

Download and install Maven from https://maven.apache.org/download.cgi

## Build the project:

mvn clean install

## Dependencies

1) Spring Boot: Backend framework for building Java-based applications.
2) Vertex AI Client: Dependency for integrating with Vertex AI for blog quality analysis. Ensure the necessary configurations and credentials are set up to communicate with Vertex AI APIs.
3) WordPress API Client: Dependency for communicating with WordPress APIs to fetch blog data based on username, blog ID, or text.

## Endpoints

The backend exposes the following endpoints:

Search Blogs:

GET /api/wordpress/posts/{id}
GET /api/wordpress/posts
GET /api/wordpress/posts-by-title
GET /api/wordpress/posts-by-author

Search blogs from WordPress APIs based on username, blog ID, or text.

## Analyze Blog Quality:

POST /api/gemini/v1/review

Endpoint to analyze the quality of a blog post using Vertex AI. Requires a JSON payload with blog content.

## Running the application:

bash
Copy code
java -jar target/blogs-analyzer.jar

## Access the API endpoints:

Once the application is running locally, you can access the API endpoints using tools like Postman or curl.
Verify API functionality:

Use the endpoints mentioned in the Endpoints section to verify functionality and interaction with WordPress APIs and Vertex AI.

