FROM node:18-alpine
WORKDIR /app
COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .
EXPOSE 5174
CMD ["npx", "expo", "start", "--port", "5174", "--host", "0.0.0.0"]
