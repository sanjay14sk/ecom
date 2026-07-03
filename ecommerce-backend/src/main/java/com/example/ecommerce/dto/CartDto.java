package com.example.ecommerce.dto;

import java.util.List;

public class CartDto {
    private Long id;
    private List<CartItemDto> items;

    public CartDto() {}

    public CartDto(Long id, List<CartItemDto> items) {
        this.id = id;
        this.items = items;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<CartItemDto> getItems() {
        return items;
    }

    public void setItems(List<CartItemDto> items) {
        this.items = items;
    }
}
