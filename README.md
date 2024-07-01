# Blogs Analyzer

[![CI/CD Pipeline](https://github.com/NashTech-Labs/Blogs-Analyzer/actions/workflows/maven.yml/badge.svg)](https://github.com/NashTech-Labs/Blogs-Analyzer/actions/workflows/maven.yml)

Blogs-Analyzer Backend is a Spring Boot application designed to search blogs from WordPress APIs based on username, blog
ID, or text. Additionally, it integrates with Vertex AI to analyze the quality of blog posts using machine learning.
Blogs-Analyzer-UI is an Angular application used to display the results on a user interface or dashboard.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Setup Instructions](#setup-instructions)
- [Dependencies](#dependencies)
- [Endpoints](#endpoints)
- [Running the Application](#running-the-application)
- [Tech Stack](#tech-stack)

## Prerequisites

Before starting, ensure you have the following installed and configured:

- **Java**: Ensure Java 21 (or compatible version) is installed.
- **Angular CLI**: Install Angular CLI globally via npm. Ensure Angular 16 is installed. You can check your Angular
  version by running `ng --version`.
- **Node.js**: Install Node.js version 18 or higher. You can download it from [here](https://nodejs.org/en/download/).
- **Maven**: Install Maven from [here](https://maven.apache.org/download.cgi). Maven 3.9+ is recommended.
- **Google Cloud SDK**: Install the Google Cloud SDK and authenticate with your Google Cloud account. Follow the
  instructions [here](https://cloud.google.com/sdk/docs/install). Then, log in to Google Cloud locally using the
  command: ```gcloud auth application-default login```
  

## Tech Stack

  | Technology       | Version |
  |------------------|---------|
  | Java             | 21      |
  | Spring Boot      | 3.3.x   |
  | Angular          | 16      |
  | Node.js          | 18.x    |
  | Maven            | 3.9+    |
  | Google Cloud SDK | Latest  |
  | Vertex AI        | Latest  |
  | WordPress API    | Latest  |


## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/NashTech-Labs/Blogs-Analyzer.git
   cd blogs-analyzer

## Dependencies

- **Spring Boot**: The core framework for building the backend application.
- **Vertex AI Client**: Used for integrating with Vertex AI for blog quality analysis. Ensure the necessary
  configurations and credentials are set up to communicate with Vertex AI APIs.
- **WordPress API Client**: Allows communication with WordPress APIs to fetch blog data based on username, blog ID, or
  text.

## Endpoints

1. #### Get a Specific Blog Post by ID

    - `GET /api/wordpress/posts/{id}` Retrieve a single blog post by its unique identifier (ID).

2. #### Get All Blog Posts

    - `GET /api/wordpress/posts` Fetch a list of all available blog posts.

3. #### Get Blog Posts by Title

    - `GET /api/wordpress/posts-by-title` Search for blog posts matching a given title.

4. #### Get Blog Posts by Author

    - `GET /api/wordpress/posts-by-author` Retrieve blog posts authored by a specific user, identified by their
      author-id.

5. #### Get List of All Available Blog Posts

    - `GET /api/wordpress` Fetch a list of all available blog posts and return the blog Id, title, status, url, author
      name, and author id.

6. #### Analyze Blog Quality
    - `POST /api/gemini/v1/review` This endpoint analyzes the quality of a blog post using Vertex AI. It requires a JSON
      payload with blog content.

## Running the application:

1. Starting spring-boot application (For Backend API)
    - Build the project:
       ```bash
      mvn clean install
      ``` 
    - Running Application:

      Run the main class from Intellij

      or
       ```bash 
       mvn spring-boot:run 
       ``` 
2. Starting Angular Application (For Dashboard)
   ```bash
   ng serve
   ```

Now, Application is running at the default port 4200. Dashboard URL: ```localhost:4200```

## Access the API endpoints:

Once the application is running locally, you can access the API endpoints using tools like Postman or curl.
Verify API functionality:

Use the endpoints mentioned in the Endpoints section to verify functionality and interaction with WordPress APIs and
Vertex AI.

 