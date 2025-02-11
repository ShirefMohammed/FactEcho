# Use Node.js as the base image
FROM node:20.12.2

# Set the working directory to /app/server
WORKDIR /app/server

# Copy server package.json and package-lock.json
COPY server/package*.json ./

# Copy root tsconfig.json to /app/tsconfig.json
COPY tsconfig.json ../

# Copy shared directory to /app/shared
COPY shared/ ../shared/

# Install server dependencies
RUN npm install

# Copy the server source code into the container
COPY server/ ./

# Expose the server port
EXPOSE 3000

# Start the server
CMD ["npm", "run", "dev"]