FROM node:18
WORKDIR /usr/src/app
COPY package*.json .
RUN npm install 
COPY . .
COPY ./src/config/certs/cert.pem /usr/src/app/cert.pem
COPY ./src/config/certs/key.pem /usr/src/app/key.pem
EXPOSE 443
CMD ["npm", "run", "start"]
