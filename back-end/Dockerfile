FROM python:3.11-alpine AS builder
WORKDIR /app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
RUN pip install .

FROM python:3.11-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 8080
CMD ["hypercorn", "app.main:app", "--bind", "0.0.0.0:8080"]
