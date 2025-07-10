# Backend Dockerfile
FROM python:3.11-slim

RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Don't hardcode PORT!
EXPOSE 8080

# Let Azure inject the correct PORT value at runtime
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port $PORT"]
