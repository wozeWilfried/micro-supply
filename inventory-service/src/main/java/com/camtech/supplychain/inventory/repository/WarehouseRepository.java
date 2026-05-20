package com.camtech.supplychain.inventory.repository;

import com.camtech.supplychain.inventory.entity.Warehouse;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WarehouseRepository extends JpaRepository<Warehouse, Long> {
}
