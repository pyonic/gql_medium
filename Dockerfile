# Base image
FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install --legacy-peer-deps

COPY . .

RUN npm run build

RUN git clone https://github.com/vishnubob/wait-for-it.git
