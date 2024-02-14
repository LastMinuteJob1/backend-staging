# Use the official Node.js 14 image.
# https://hub.docker.com/_/node
FROM node:16

# Create app directory.
WORKDIR /usr/src/app

# Copy package.json and package-lock.json to the working directory.
COPY package*.json ./

# Install any needed packages specified in package.json.
RUN npm install

# Bundle app source.
COPY . .

# Make port 8080 available to the world outside this container.
EXPOSE 8080

# Run the app when the container launches.
CMD [ "npm", "start" ]