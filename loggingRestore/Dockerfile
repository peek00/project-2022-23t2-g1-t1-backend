FROM node:latest
WORKDIR /app/admin-proxy
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm","start"]