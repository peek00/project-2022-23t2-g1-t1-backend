FROM maven:3.8.1-openjdk-17-slim AS builder
WORKDIR ./
COPY pom.xml .
RUN mvn -e -B dependency:resolve
COPY src ./src
RUN mvn clean -DskipTests -e -B package

FROM openjdk:17-jdk-slim
VOLUME /tmp
COPY --from=builder /target/*.jar /User-0.0.1-SNAPSHOT.jar
ENTRYPOINT ["java", "-jar", "/User-0.0.1-SNAPSHOT.jar"]