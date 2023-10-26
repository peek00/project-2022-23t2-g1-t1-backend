FROM node:latest
WORKDIR /app/logging
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm","start"]