# Этап сборки
FROM node:20-alpine AS builder

# Установка рабочей директории
WORKDIR /app

# Копирование файлов зависимостей
COPY package.json yarn.lock ./

# Установка зависимостей
RUN yarn install --frozen-lockfile

# Копирование исходного кода
COPY . .

# Передача переменных окружения
ARG REACT_APP_API_URL
ENV REACT_APP_API_URL=$REACT_APP_API_URL

# Сборка приложения
RUN yarn build

# Этап продакшена
FROM nginx:alpine

ARG NGINX_CONFIG_NAME
ENV NGINX_CONFIG_NAME=${NGINX_CONFIG_NAME}
# Копирование конфигурации nginx
COPY ./nginx/${NGINX_CONFIG_NAME} /etc/nginx/conf.d/default.conf

# Копирование собранного приложения из этапа сборки
COPY --from=builder /app/build /usr/share/nginx/html

# Открытие портов
EXPOSE 80 443

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"] 