# inventory-service/Dockerfile
# ─────────────────────────────────────────────
# Étape 1 : Build Maven (image builder)
# ─────────────────────────────────────────────
FROM maven:3.9.6-eclipse-temurin-17-alpine AS builder

WORKDIR /app

# Copier le pom.xml en premier pour bénéficier du cache Docker (layers)
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copier le code source et builder
COPY src ./src
RUN mvn clean package -DskipTests -B

# ─────────────────────────────────────────────
# Étape 2 : Image de production (légère)
# ─────────────────────────────────────────────
FROM eclipse-temurin:17-jre-alpine AS production

# Créer un utilisateur non-root (bonne pratique sécurité)
RUN addgroup -S appgroup && adduser -S appuser -G appgroup

WORKDIR /app

# Copier le JAR depuis l'étape builder
COPY --from=builder /app/target/*.jar app.jar

# Changer le propriétaire du fichier
RUN chown appuser:appgroup app.jar

# Utiliser l'utilisateur non-root
USER appuser

# Exposer le port de l'application
EXPOSE 8080

# Health check Docker natif basé sur Spring Actuator
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/actuator/health || exit 1

# Point d'entrée avec optimisations JVM pour conteneurs
ENTRYPOINT ["java", \
  "-Djava.security.egd=file:/dev/./urandom", \
  "-XX:+UseContainerSupport", \
  "-XX:MaxRAMPercentage=75.0", \
  "-jar", "app.jar"]
