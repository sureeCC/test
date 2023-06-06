FROM node:14-slim
WORKDIR /app
COPY . . /app/
COPY package*.json ./
EXPOSE 3000
CMD [ "npm", "start" ]