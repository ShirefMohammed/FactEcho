# Use Node.js as the base image
FROM node:20.12.2

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY client/react/package*.json ./

# Copy the root-level tsconfig.json
COPY tsconfig.json ./

# Copy the client-specific tsconfig.json
COPY client/react/tsconfig.json ./tsconfig.client.json

# Copy the shared directory
COPY shared/ ./shared/

# Install dependencies
RUN npm install

# Copy the rest of the client application code
COPY client/react/ ./client/react/

# Expose the client port
EXPOSE 5173

# Start the client
CMD ["npm", "run", "dev"]