package com.camtech.supplychain.inventory.repository;

import com.camtech.supplychain.inventory.entity.StockMovement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface StockMovementRepository extends JpaRepository<StockMovement, Long> {

    /**
     * Calcule le stock courant d'un produit dans un entrepôt donné.
     * Stock = SUM(entrées) - SUM(sorties) + SUM(transferts reçus) - SUM(transferts envoyés)
     */
    @Query("""
        SELECT COALESCE(
            SUM(CASE
                WHEN m.movementType = 'IN' OR m.destinationWarehouse.id = :warehouseId THEN m.quantity
                WHEN m.movementType = 'OUT' OR m.sourceWarehouse.id = :warehouseId THEN -m.quantity
                ELSE 0
            END), 0)
        FROM StockMovement m
        WHERE m.product.id = :productId
          AND (m.destinationWarehouse.id = :warehouseId OR m.sourceWarehouse.id = :warehouseId)
    """)
    Integer findCurrentStockByProductAndWarehouse(
        @Param("productId") Long productId,
        @Param("warehouseId") Long warehouseId
    );

    /**
     * Récupère les 50 derniers mouvements pour l'historique
     */
    List<StockMovement> findTop50ByOrderByTimestampDesc();
}
