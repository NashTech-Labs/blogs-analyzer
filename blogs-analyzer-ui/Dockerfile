# Stage 1: Build the Angular application
FROM node:21 AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install Angular CLI globally
RUN npm install -g @angular/cli

# Install dependencies
RUN npm install

# Copy the rest of the application code to the working directory
COPY . .

# Build the Angular app in production mode
RUN ng build

# Stage 2: Use a smaller, nginx-based image to serve the app
FROM nginx:1.21-alpine

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/nginx.conf

# Create log directory configured in nginx.conf
RUN mkdir -p /var/log/app_engine

# Copy the built app from the previous stage to the nginx web server directory
COPY --from=build /app/dist/blogs-analyzer-ui /usr/share/nginx/html

# Expose port 80 to the Docker environment
EXPOSE 80

# Command to run nginx when the container starts
CMD ["nginx", "-g", "daemon off;"]
