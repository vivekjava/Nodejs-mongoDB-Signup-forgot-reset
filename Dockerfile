FROM node:carbon
WORKDIR /
COPY . /
RUN npm install
EXPOSE 3000
CMD node index.js   