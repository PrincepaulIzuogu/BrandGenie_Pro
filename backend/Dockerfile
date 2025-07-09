# Backend Dockerfile
FROM python:3.11-slim

RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

# Set correct runtime port for Azure
ENV PORT=80
EXPOSE 80

# Start the FastAPI app on port 80
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "80"]
