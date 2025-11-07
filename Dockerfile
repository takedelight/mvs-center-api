FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npx prisma generate


EXPOSE 3000

CMD npx prisma db push && npx prisma db seed && node src/main.js
