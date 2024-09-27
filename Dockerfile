FROM node:16-alpine

# Docker 컨테이너 내부에서 작업할 디렉토리 설정
WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]