# Build stage
FROM eclipse-temurin:21-jdk-jammy AS builder
WORKDIR /app
COPY .mvn/ .mvn
COPY mvnw pom.xml ./
RUN ./mvnw dependency:go-offline

# 1. Копируем .env в первую очередь
COPY .env .
COPY src/ src/
RUN ./mvnw clean package -DskipTests

# Runtime stage
FROM eclipse-temurin:21-jre-jammy
WORKDIR /app

RUN useradd -m appuser && chown -R appuser /app
USER appuser

# 2. Копируем .env в финальный образ
COPY --from=builder --chown=appuser /app/target/*.jar ./app.jar
COPY --from=builder --chown=appuser /app/.env .

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]