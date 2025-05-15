FROM node:18-alpine

WORKDIR /app

# Install expo-cli and @expo/ngrok globally to prevent interactive install prompt
RUN npm install -g expo-cli @expo/ngrok@^4.1.0

COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 19002
CMD ["npx", "expo", "start", "--dev-client", "--port", "19000", "--tunnel"]
