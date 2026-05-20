# Sécurité — Module Supply Chain DIGITRANS-CM

## 1. Stratégie d'authentification : JWT (JSON Web Tokens)
**Choix retenu : JWT avec Spring Security**

Justification :
- **Stateless** : le serveur ne maintient pas de session -> scalabilité horizontale facilitée
- **Standard ouvert** (RFC 7519) : compatible avec tous les clients (React, mobile)
- **Performant** : validation locale du token sans appel base de données à chaque requête
- Durée de validité courte (15 min) + refresh token (7 jours) pour limiter l'exposition

## 2. Gestion des secrets — Variables sensibles
Toutes les variables sensibles sont injectées via des variables d'environnement au runtime, jamais stockées dans le code source (utilisation d'AWS Secrets Manager en prod et GitHub Secrets en CI/CD).

## 3. Bonnes pratiques sécurité dans les Dockerfiles
- **Utilisateur non-root** : RUN addgroup -S appgroup && adduser -S appuser -G appgroup
- **Image minimale** : eclipse-temurin:17-jre-alpine (JRE uniquement)
- **Build multi-stage** : Pas de Maven ni de code source dans l'image finale.
- **.dockerignore** : Exclusion des fichiers sensibles (.env, target/) du contexte de build.
