# Use Node.js as the base image
FROM node:20.12.2

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY server/package*.json ./

# Copy the root-level tsconfig.json
COPY tsconfig.json ./

# Copy the server-specific tsconfig.json
COPY server/tsconfig.json ./tsconfig.server.json

# Copy the shared directory
COPY shared/ ./shared/

# Install dependencies
RUN npm install

# Copy the rest of the server application code
COPY server/ ./server/

# Expose the server port
EXPOSE 3000

# Start the server
CMD ["npm", "run", "dev"]