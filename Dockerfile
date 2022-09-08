FROM node:18-alpine3.15
CMD npm i -g yarn && npm i -g @nestjs/cli
WORKDIR src/app
COPY package*.json ./
RUN yarn install
COPY . .
EXPOSE 3000
ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait
CMD /wait && npx prisma migrate deploy && yarn start