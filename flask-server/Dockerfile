# 1) 파이썬 베이스 이미지 선택
FROM python:3.10-slim

# 2) 컨테이너 안 작업 디렉토리 설정
WORKDIR /app

# 3) 필요한 파일들 복사
# requirements.txt 먼저 복사 → 의존성 먼저 설치
COPY requirements.txt /app/requirements.txt
RUN pip install --no-cache-dir -r /app/requirements.txt

# 4) 서버 코드 복사
COPY server.py /app/server.py

# 5) 환경변수로 Flask가 어떤 포트에서 돌아가는지 알려주기 (문서적 의미)
ENV PORT=5002

# 6) 컨테이너가 외부에 노출할 포트
EXPOSE 5002

# 7) 실제 실행 커맨드
# OPENAI_API_KEY는 나중에 docker run 할 때 주입할 거라 여기선 안 박아.
CMD ["python", "server.py"]
