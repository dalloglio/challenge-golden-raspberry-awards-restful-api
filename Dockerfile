FROM node:20.11.1-alpine3.19 AS build

WORKDIR /home/node/app

COPY package*.json .

RUN npm ci

COPY . .

RUN npm test

RUN npx tsc


FROM node:20.11.1-alpine3.19

WORKDIR /home/node/app

COPY --from=build --chown=node /home/node/app/node_modules node_modules
COPY --from=build --chown=node /home/node/app/dist dist

CMD [ "node", "dist/main.js" ]

USER node
