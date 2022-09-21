# Docker file for nodejs express
FROM node:latest
# Create app directory
WORKDIR /usr/src/app
# Install app dependencies
COPY package*.json ./
RUN npm install
# Bundle app source
COPY . .
EXPOSE 3000
# prisma generate
RUN npx prisma generate
# npm run start
CMD [ "npm", "start" ]