FROM node:18-alpine

WORKDIR /app

# Preinstall dependencies including ngrok
COPY package.json ./
RUN npm install --legacy-peer-deps && npm install -g @expo/ngrok

COPY . .

EXPOSE 5174

CMD ["npx", "expo", "start", "--tunnel", "--non-interactive"]
