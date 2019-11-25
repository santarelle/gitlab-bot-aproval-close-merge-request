FROM node:8.11-alpine

ARG HTTP_PROXY

RUN npm config set registry http://registry.npmjs.org --global \
    && npm config set proxy ${HTTP_PROXY} \
    && npm config set https-proxy ${HTTP_PROXY} \
    && npm config set strict-ssl false

WORKDIR /app

COPY . /app

RUN npm install && npm cache clean --force

CMD [ "npm", "start"]
