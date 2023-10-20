FROM node:latest
WORKDIR /app/admin-proxy
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8000
CMD ["npm","start"]