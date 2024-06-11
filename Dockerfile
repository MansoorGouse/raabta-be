# Specify the base image platform
FROM --platform=linux/arm64/v4 node:18-alpine

WORKDIR /ws

COPY package.json ./
COPY package-lock.json ./

RUN npm install --frozen-lockfile

COPY . .

RUN npm run build

CMD ["node", "."]

EXPOSE 8080
