FROM node:18-alpine3.15
WORKDIR /usr/src

COPY package.json .
RUN yarn install

COPY . .

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.2.1/wait /wait
RUN chmod +x /wait

CMD /wait &&\
    npx prisma generate &&\
    npx prisma migrate deploy &&\
    yarn start

EXPOSE 3000