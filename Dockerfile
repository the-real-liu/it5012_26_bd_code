# frontend
FROM node:24 AS frontend-builder
WORKDIR /app/frontend
RUN corepack enable
COPY frontend .
RUN yarn install
RUN yarn build

# backend
FROM python:3.13-slim
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
RUN apt-get update && apt-get install -y \
    apache2 \
    apache2-dev \
    build-essential \
    curl \
    && rm -rf /var/lib/apt/lists/*
RUN curl -Ls https://astral.sh/uv/install.sh | sh
ENV PATH="/root/.local/bin:$PATH"
WORKDIR /app
COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --frozen --no-dev
COPY backend /app/backend
RUN uv pip install mod_wsgi

COPY --from=frontend-builder /app/frontend/dist /app/frontend_dist
RUN uv run mod_wsgi-express install-module > /etc/apache2/mods-available/wsgi.load
RUN a2enmod wsgi
RUN a2enmod rewrite
COPY docker/apache.conf /etc/apache2/sites-available/000-default.conf
COPY docker/setup.sh /setup.sh
RUN chmod a+x /setup.sh

VOLUME /data
EXPOSE 80
CMD ["apachectl", "-D", "FOREGROUND"]

