FROM node:buster-slim as builder

# install prerequisites
RUN apt-get update \
    && apt-get install --no-install-recommends --reinstall -y ca-certificates git \
    && yarn global add gatsby-cli \
    && apt-get clean \
    && apt-get autoclean \
    && git config --global user.email "boogi@github.com" \
    && git config --global user.name "BooGi"

# install required BooGi dependencies (with caching)
WORKDIR /boogi

COPY package*.json ./
COPY yarn.lock ./

RUN yarn

# install BooGi
COPY . .

RUN npm install -g .

# run in /app dir
WORKDIR /app

ENTRYPOINT ["boogi"] 
