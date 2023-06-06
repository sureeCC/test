FROM node:14-slim
WORKDIR /app
COPY . . /app/
COPY package*.json ./
RUN npm install
RUN npm run build
EXPOSE 3000
CMD [ "npm", "start" ]