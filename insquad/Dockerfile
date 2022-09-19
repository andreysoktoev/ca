FROM node:18-alpine
WORKDIR /app
COPY package.json .
RUN npm i --omit=dev
COPY . .
CMD [ "node", "app.js" ]