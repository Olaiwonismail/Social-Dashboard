FROM python:3.11-slim

WORKDIR /app

# 1. Copy just requirements to leverage Docker cache
COPY requirements.txt ./

# 2. Install dependencies
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

# 3. Copy your app source (including setup.py or pyproject.toml if you have one)
COPY . .

# 4. (Optional) If you *do* have a setup.py / pyproject.toml, install your package
# RUN pip install .

# 5. Start your app
CMD ["gunicorn", "main:app", "--bind", "0.0.0.0:8000", "--worker-class", "uvicorn.workers.UvicornWorker"]
