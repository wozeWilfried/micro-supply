# Optimisation et Haute Disponibilité — Module Supply Chain DIGITRANS-CM

## 1. Gestion des pannes réseau au Cameroun — Résilience locale
- **React (Frontend)** : Mise en cache agressive Nginx et utilisation future d'IndexedDB pour stocker localement les mouvements en cas de coupure internet.
- **RabbitMQ (Message Broker)** : Publication asynchrone des messages avec persistance sur disque (`durable: true`) pour éviter les pertes de données logistiques.

## 2. Stratégie de mise en cache applicative
- Cache HTTP via Nginx (`Cache-Control`) pour les fichiers statiques et données de référence.
- Cache applicatif Spring Boot (`@Cacheable`) pour alléger les requêtes SQL complexes du Dashboard.

## 3. Stratégie de Scaling (Passage à l'échelle)
- Architecture totalement stateless permettant de dupliquer les instances applicatives (`replicas: 3`) derrière un Load Balancer (AWS ALB ou Nginx).

## 4. Stratégie d'indexation de la Base de Données (PostgreSQL)
- Indexation composite B-Tree sur `stock_movement(product_id, created_at)` pour garantir un calcul instantané de la matrice des stocks courants.
