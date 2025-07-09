# Backend Dockerfile
FROM python:3.11-slim

# Install only PostgreSQL-related system dependencies
RUN apt-get update && apt-get install -y gcc libpq-dev && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy the requirements.txt file from the backend folder into the container
COPY ./backend/requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the backend code into the container
COPY ./backend/ .

# Verify the contents of the /app/src directory for debugging
RUN ls /app/src


# Run FastAPI server
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--reload"]
