# Use official Node.js image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy application source
COPY . .

# Expose port (as defined in your .env or default)
EXPOSE 5000

# Start the server
CMD ["npm", "start"]
