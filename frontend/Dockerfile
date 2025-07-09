# Frontend Dockerfile (inside ./frontend)

FROM node:18-slim

# Set working directory
WORKDIR /app

# Clear npm cache
RUN npm cache clean --force

# Install dependencies
COPY package*.json ./

RUN npm install --legacy-peer-deps --verbose


# Copy the rest of the frontend code into the container
COPY . .

# Build the app
RUN npm run build

# Serve with a static file server
RUN npm install -g serve

# Expose port (optional for documentation, Azure ignores it)
EXPOSE 3000

# 🔥 Use environment variable PORT (required by Azure)
CMD ["serve", "-s", "dist", "-l", "${PORT}"]
