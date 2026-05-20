package com.camtech.supplychain.notification.consumer;

import com.camtech.supplychain.notification.dto.StockAlertEvent;
import lombok.extern.slf4j.Slf4j;
import org.springframework.amqp.rabbit.annotation.RabbitListener;
import org.springframework.stereotype.Component;

@Component
@Slf4j
public class StockAlertConsumer {

    /**
     * Écoute la queue RabbitMQ "stock.alert.queue".
     * Déclenché automatiquement dès qu'un événement de stock critique est publié
     * par l'inventory-service.
     */
    @RabbitListener(queues = "${app.rabbitmq.queue.stock-alert}")
    public void handleStockAlert(StockAlertEvent event) {
        log.warn("🚨 ALERTE STOCK CRITIQUE reçue !");
        log.warn("   Produit     : {} (ID: {})", event.getProductName(), event.getProductId());
        log.warn("   Entrepôt ID : {}", event.getWarehouseId());
        log.warn("   Stock actuel: {} unités", event.getCurrentStock());
        log.warn("   Seuil alerte: {} unités", event.getThreshold());
        log.warn("   Horodatage  : {}", event.getAlertTimestamp());

        // Extension possible : envoyer un email, SMS (Orange/MTN Cameroon API), webhook Slack, etc.
    }
}
