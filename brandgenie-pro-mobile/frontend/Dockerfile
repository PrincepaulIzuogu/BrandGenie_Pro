FROM node:18-alpine

WORKDIR /app

COPY package.json ./
RUN npm install --legacy-peer-deps

COPY . .

# Expose the DevTools port (19002) which is mapped to 5174 outside
EXPOSE 19002

CMD ["npx", "expo", "start", "--dev-client", "--port", "19000", "--devtools-port", "19002", "--host", "0.0.0.0"]
