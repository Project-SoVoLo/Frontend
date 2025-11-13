# 1) Node 베이스 이미지
FROM node:20-slim

# 2 ) 작업 디렉토리 설정
WORKDIR /app

# 3 ) 의존성 설치
COPY package*.json ./
RUN npm install

# 4 ) 나머지 소스 복사
COPY . .

# 5 ) 개발 서버 포트 3000
EXPOSE 3000

# 6 ) 리액트 서버 실행
CMD ["npm", "start"]