# Use a more efficient base image
FROM python:3.9-slim

WORKDIR /app

# Copy only the requirements file first to leverage Docker cache
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Now copy the rest of the application to avoid reinstalling packages when other files change
COPY . .

# Define a volume to persist installed packages - Consideration: might not be needed if packages are baked into the image
# VOLUME /usr/local/lib/python3.9/site-packages

# Command to run when the container starts
# CMD []
