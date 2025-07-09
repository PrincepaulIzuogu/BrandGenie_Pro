# Backend Dockerfile
FROM python:3.11-slim

# Install PostgreSQL-related system dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code
COPY . .

# Use environment PORT if available (Azure provides it)
ENV PORT=8000

# Expose for documentation (not mandatory)
EXPOSE $PORT

# Run FastAPI using the dynamic port
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT}"]
