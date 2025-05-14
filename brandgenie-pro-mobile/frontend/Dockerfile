FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --legacy-peer-deps
COPY . .

EXPOSE 19000 19001 19002 5174 8081

CMD ["npx", "expo", "start"]
