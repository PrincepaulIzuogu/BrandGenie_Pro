# brandgenie-pro-mobile/frontend/Dockerfile

FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies
COPY package.json ./
RUN npm install --legacy-peer-deps

# Copy the rest of the project files
COPY . .

# Expose only the DevTools UI port
EXPOSE 19002

# Start Expo in tunnel mode for QR accessibility from browser
CMD ["npx", "expo", "start", "--dev-client", "--port", "19000", "--host", "tunnel"]
