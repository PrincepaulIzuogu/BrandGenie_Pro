FROM node:18-alpine

WORKDIR /app

# Install expo-cli and @expo/ngrok globally
RUN npm install -g expo-cli @expo/ngrok@^4.1.0

COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 19002  # Expo DevTools UI
CMD ["npx", "expo", "start", "--dev-client", "--port", "19000", "--tunnel"]
