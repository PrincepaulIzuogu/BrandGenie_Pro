# Backend Dockerfile 
FROM python:3.11-slim

# Install system dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy dependencies and install
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy app and start script
COPY . .
COPY start.sh .
RUN chmod +x start.sh

# ✅ Create the static folder FastAPI expects
RUN mkdir -p uploaded_media

# Expose FastAPI port
EXPOSE 5000

# Unbuffered logs
ENV PYTHONUNBUFFERED=1

# Start with shell script
CMD ["./start.sh"]
