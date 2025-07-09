# Frontend Dockerfile
FROM node:16-slim

# Set working directory
WORKDIR /app

# Clear npm cache
RUN npm cache clean --force

# Install dependencies
COPY ./frontend/package*.json ./

# Install dependencies
RUN npm install --verbose

# Copy the rest of the frontend code into the container
COPY ./frontend .

# Build the app
RUN npm run build

# Serve with a static file server
RUN npm install -g serve
CMD ["serve", "-s", "dist", "-l", "3000"]
