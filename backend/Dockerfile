# Stage 1: Build the Spring Boot application using Maven
FROM maven:3-eclipse-temurin-17 AS build
WORKDIR /app
COPY . .
RUN mvn clean package -DskipTests

# Stage 2: Run the built JAR file using a lightweight JRE image
FROM eclipse-temurin:17-alpine
WORKDIR /app
COPY --from=build /app/target/*.jar opsflow-backend.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "opsflow-backend.jar"]
