FROM python:3.12

RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    libpq-dev \
    build-essential \
    python3-dev \
    python3-venv \
    && apt-get clean && \
    rm -rf /var/lib/apt/lists/*

RUN python3 -m venv /opt/venv
ENV PATH="/opt/venv/bin:$PATH"

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
