FROM node:6.10.3

RUN mkdir -p /image-serverless
WORKDIR /image-serverless

COPY package.json /image-serverless

COPY . /image-serverless

CMD ["npm", "test"]

