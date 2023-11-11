FROM node:latest
# ENV TZ=Asia/Singapore
# RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
WORKDIR /app/admin-proxy
COPY package*.json ./
RUN npm i
COPY . .
RUN npm run build
EXPOSE 8000
CMD ["npm","start"]