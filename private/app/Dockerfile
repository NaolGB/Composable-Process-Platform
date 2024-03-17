FROM node:20.10.0

WORKDIR /app
COPY package*.json ./
RUN npm install -g @angular/cli@17.2.1

RUN npm install
COPY . .
EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--poll", "1"]
