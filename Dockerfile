FROM node:20.11.1-alpine3.19

WORKDIR /home/node/app

USER node

CMD [ "tail", "-f", "/dev/null" ]
