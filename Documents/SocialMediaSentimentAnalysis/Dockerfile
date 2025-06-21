# Backend Dockerfile
FROM node:16

WORKDIR /usr/src/app

COPY backend/package*.json ./

RUN npm install

COPY backend .

EXPOSE 5000

CMD ["node", "server.js"]