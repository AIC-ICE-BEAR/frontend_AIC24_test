# Use a newer Node.js base image (e.g., 16.x)
FROM node:16

# Set the working directory in the container
WORKDIR /app

# Set npm registry to use HTTPS
RUN npm config set registry https://registry.npmjs.org/

# Expose the port that the app will run on
EXPOSE 3000

# Install dependencies and run the app
ENTRYPOINT ["sh", "-c", "npm install --legacy-peer-deps && npm run start"]
