package com.example.ecommerce.dto;

import java.math.BigDecimal;

public class DashboardDto {
    private Long totalOrders;
    private BigDecimal totalSales;
    private Long totalUsers;
    private Long totalProducts;

    public DashboardDto() {}

    public DashboardDto(Long totalOrders, BigDecimal totalSales, Long totalUsers, Long totalProducts) {
        this.totalOrders = totalOrders;
        this.totalSales = totalSales;
        this.totalUsers = totalUsers;
        this.totalProducts = totalProducts;
    }

    public Long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(Long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public BigDecimal getTotalSales() {
        return totalSales;
    }

    public void setTotalSales(BigDecimal totalSales) {
        this.totalSales = totalSales;
    }

    public Long getTotalUsers() {
        return totalUsers;
    }

    public void setTotalUsers(Long totalUsers) {
        this.totalUsers = totalUsers;
    }

    public Long getTotalProducts() {
        return totalProducts;
    }

    public void setTotalProducts(Long totalProducts) {
        this.totalProducts = totalProducts;
    }
}
