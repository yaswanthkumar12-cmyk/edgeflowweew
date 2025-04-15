# # frontend/Dockerfile

# # Step 1: Build the React app
# FROM node:18 AS build
# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build

# # Step 2: Serve the app using Nginx
# FROM nginx:alpine
# COPY --from=build /app/build /usr/share/nginx/html
# EXPOSE 80
# CMD ["nginx", "-g", "daemon off;"]




# Use official Node.js image as the base image
FROM node:18 AS build

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to install dependencies
COPY package*.json ./

# Install all dependencies
RUN npm install

# Copy the rest of the React app code to the container
COPY . .

# Build the React app for production
RUN npm run build

# Use a smaller image to serve the built app
FROM nginx:alpine

# Copy the build files from the first stage to the nginx container
COPY --from=build /app/build /usr/share/nginx/html

# Expose the default port for nginx
EXPOSE 80

# Start nginx server to serve the React app
CMD ["nginx", "-g", "daemon off;"]
