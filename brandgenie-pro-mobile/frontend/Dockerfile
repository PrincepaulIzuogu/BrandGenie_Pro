FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install expo-cli and required packages globally to avoid interactive prompts
RUN npm install -g expo-cli @expo/ngrok@^4.1.0

# Copy only the package.json first to leverage Docker layer caching
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy the remaining project files
COPY . .

# Expose the Expo DevTools port (for QR code UI)
EXPOSE 19002

# Start the Expo app with tunnel mode and Dev Client enabled on a custom port (to avoid 8081 conflict)
CMD ["npx", "expo", "start", "--dev-client", "--port", "8082", "--tunnel"]
