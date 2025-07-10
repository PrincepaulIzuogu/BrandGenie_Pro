# Backend Dockerfile
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependencies and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy source code and start script
COPY . .
COPY start.sh .
RUN chmod +x start.sh

# Ensure static folder exists
RUN mkdir -p uploaded_media

# Expose FastAPI port
EXPOSE 5000

# Unbuffered logs for real-time output in Azure
ENV PYTHONUNBUFFERED=1

# Run app using shell script
CMD ["./start.sh"]
