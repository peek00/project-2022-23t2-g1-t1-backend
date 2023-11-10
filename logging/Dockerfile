FROM node:latest
ENV TZ=Asia/Singapore
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /app/logging
COPY package*.json ./
RUN npm install
COPY . .
CMD ["npm","start"]