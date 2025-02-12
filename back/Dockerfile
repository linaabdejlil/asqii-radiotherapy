# Use an official Node.js runtime as a parent image
FROM node:16.16

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install app dependencies
RUN npm install
RUN npm install --save bcryptjs && npm uninstall --save bcrypt
RUN npm rebuild bcrypt --build-from-source

# Copy the rest of the application code
COPY . .

# Make sure the wait-for-it.sh script is executable
COPY scripts/wait-for-it.sh /app/scripts/wait-for-it.sh
RUN chmod +x /app/scripts/wait-for-it.sh

# Expose the port on which the app runs
EXPOSE 4001

# Define the command to run your backend
CMD ["npm", "start"]
