package com.camtech.supplychain.notification.dto;

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
    private LocalDateTime alertTimestamp;
}
