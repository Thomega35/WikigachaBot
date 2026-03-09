FROM node:24-slim

WORKDIR /app

# Install system dependencies for Chrome + GUI environment
RUN apt-get update && apt-get install -y \
    xvfb \
    fluxbox \
    x11vnc \
    dbus \
    mesa-utils \
    libgl1 \
    libnss3 \
    libatk1.0-0 \
    libatk-bridge2.0-0 \
    libcups2 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm1 \
    libgtk-3-0 \
    libasound2 \
    fonts-liberation \
    fonts-dejavu \
    ca-certificates \
    wget \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Node dependencies
COPY package*.json ./
RUN npm install --production

# Install Patchright browser
RUN npx patchright install chrome

# Create persistent profile folder
RUN mkdir -p /app/patchright_profile

# Copy source
COPY . .

# Optional volume for persistent browser profile
VOLUME ["/app/patchright_profile"]

# Start virtual display + window manager + bot using JSON form
# wrapping the shell commands in a single sh invocation ensures signal handling
CMD sh -c "xvfb-run -a --server-args='-screen 0 1920x1080x24' node wikigacha.js"