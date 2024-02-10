FROM python:3.9

WORKDIR /app

COPY . .

RUN pip install --no-cache-dir -r requirements.txt

# Define a volume to persist installed packages
VOLUME /usr/local/lib/python3.9/site-packages

# Command to run when the container starts
CMD []