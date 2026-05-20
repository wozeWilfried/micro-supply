# frontend/Dockerfile

# ─── Étape 1 : Build React avec Node ───────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Installer les dépendances (cache Docker optimisé)
COPY package.json package-lock.json ./
RUN npm ci --silent

# Copier le code source et builder
COPY . .
RUN npm run build

# ─── Étape 2 : Servir avec Nginx (image légère) ─────────
FROM nginx:1.25-alpine AS production

# Copier le build React vers Nginx
COPY --from=builder /app/dist /usr/share/nginx/html

# Copier la config Nginx pour React Router (SPA routing)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s \
  CMD wget --no-verbose --tries=1 --spider http://localhost:80 || exit 1

CMD ["nginx", "-g", "daemon off;"]
