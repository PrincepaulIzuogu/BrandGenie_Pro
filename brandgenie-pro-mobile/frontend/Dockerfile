FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .

EXPOSE 19002  # DevTools UI
CMD ["npx", "expo", "start", "--port", "19000", "--host", "tunnel"]
