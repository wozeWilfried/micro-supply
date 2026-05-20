package com.camtech.supplychain.inventory.service;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class StockAlertEvent {
    private Long productId;
    private String productName;
    private Long warehouseId;
    private Integer currentStock;
    private Integer threshold;
    private LocalDateTime alertTimestamp = LocalDateTime.now();

    // Constructeur sans timestamp (auto-assigné)
    public StockAlertEvent(Long productId, String productName,
                           Long warehouseId, Integer currentStock, Integer threshold) {
        this.productId = productId;
        this.productName = productName;
        this.warehouseId = warehouseId;
        this.currentStock = currentStock;
        this.threshold = threshold;
        this.alertTimestamp = LocalDateTime.now();
    }
}
