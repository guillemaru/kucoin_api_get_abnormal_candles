FROM node:14-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy main.js and pair.js
COPY main.js .
COPY pair.js .

# Start the application
CMD ["node", "main.js"]
