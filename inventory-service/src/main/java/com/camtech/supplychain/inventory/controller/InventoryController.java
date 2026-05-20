package com.camtech.supplychain.inventory.controller;

import com.camtech.supplychain.inventory.entity.*;
import com.camtech.supplychain.inventory.repository.*;
import com.camtech.supplychain.inventory.service.InventoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1")
@RequiredArgsConstructor
@CrossOrigin(origins = "${FRONTEND_URL:http://localhost:3000}")
public class InventoryController {

    private final InventoryService inventoryService;
    private final ProductRepository productRepository;
    private final WarehouseRepository warehouseRepository;
    private final StockMovementRepository movementRepository;

    // ─── Produits ────────────────────────────────────────
    @GetMapping("/products")
    public List<Product> getAllProducts() {
        return inventoryService.getAllProducts();
    }

    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@RequestBody Product product) {
        return ResponseEntity.ok(inventoryService.createProduct(product));
    }

    // ─── Entrepôts ───────────────────────────────────────
    @GetMapping("/warehouses")
    public List<Warehouse> getAllWarehouses() {
        return warehouseRepository.findAll();
    }

    @PostMapping("/warehouses")
    public ResponseEntity<Warehouse> createWarehouse(@RequestBody Warehouse warehouse) {
        return ResponseEntity.ok(warehouseRepository.save(warehouse));
    }

    // ─── Mouvements de stock ─────────────────────────────
    @PostMapping("/movements")
    public ResponseEntity<StockMovement> createMovement(@RequestBody StockMovement movement) {
        // Résoudre les entités depuis la BDD avant traitement
        movement.setProduct(productRepository.findById(movement.getProduct().getId()).orElseThrow());
        if (movement.getSourceWarehouse() != null) {
            movement.setSourceWarehouse(
                warehouseRepository.findById(movement.getSourceWarehouse().getId()).orElseThrow()
            );
        }
        if (movement.getDestinationWarehouse() != null) {
            movement.setDestinationWarehouse(
                warehouseRepository.findById(movement.getDestinationWarehouse().getId()).orElseThrow()
            );
        }
        return ResponseEntity.ok(inventoryService.processMovement(movement));
    }

    @GetMapping("/movements")
    public List<StockMovement> getRecentMovements() {
        return movementRepository.findTop50ByOrderByTimestampDesc();
    }

    // ─── Stock courant ───────────────────────────────────
    @GetMapping("/stock/current")
    public ResponseEntity<Map<String, Integer>> getCurrentStock(
        @RequestParam Long productId,
        @RequestParam Long warehouseId) {
        Integer stock = movementRepository.findCurrentStockByProductAndWarehouse(productId, warehouseId);
        return ResponseEntity.ok(Map.of("currentStock", stock != null ? stock : 0));
    }
}
