package com.camtech.supplychain.inventory.service;

import com.camtech.supplychain.inventory.entity.*;
import com.camtech.supplychain.inventory.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class InventoryService {

    private final StockMovementRepository movementRepository;
    private final ProductRepository productRepository;
    private final RabbitTemplate rabbitTemplate;

    @Value("${app.rabbitmq.exchange}")
    private String exchange;

    @Value("${app.rabbitmq.routing-key.stock-alert}")
    private String stockAlertRoutingKey;

    /**
     * Enregistre un mouvement de stock et vérifie le seuil d'alerte.
     * Publie un événement RabbitMQ si le stock devient critique.
     */
    @Transactional
    public StockMovement processMovement(StockMovement movement) {
        // 1. Persister le mouvement
        StockMovement saved = movementRepository.save(movement);
        log.info("Mouvement enregistré : type={}, produit={}, quantité={}",
            movement.getMovementType(), movement.getProduct().getName(), movement.getQuantity());

        // 2. Calculer le stock courant après ce mouvement
        Long warehouseId = movement.getMovementType() == StockMovement.MovementType.IN
            ? movement.getDestinationWarehouse().getId()
            : movement.getSourceWarehouse().getId();

        Integer currentStock = movementRepository.findCurrentStockByProductAndWarehouse(
            movement.getProduct().getId(), warehouseId
        );

        // 3. Vérifier le seuil d'alerte et publier l'événement si nécessaire
        Product product = movement.getProduct();
        if (currentStock != null && currentStock <= product.getAlertThreshold()) {
            log.warn("STOCK CRITIQUE : {} - stock courant={}, seuil={}",
                product.getName(), currentStock, product.getAlertThreshold());

            StockAlertEvent event = new StockAlertEvent(
                product.getId(),
                product.getName(),
                warehouseId,
                currentStock,
                product.getAlertThreshold()
            );

            // Publier sur RabbitMQ
            rabbitTemplate.convertAndSend(exchange, stockAlertRoutingKey, event);
            log.info("Événement stock critique publié pour le produit : {}", product.getName());
        }

        return saved;
    }

    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    public Product createProduct(Product product) {
        return productRepository.save(product);
    }
}
