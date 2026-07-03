package com.example.ecommerce.service;

import com.example.ecommerce.dto.CartDto;

public interface CartService {
    CartDto getCartOfUser(Long userId);
    CartDto addItemToCart(Long userId, Long productId, Integer quantity);
    CartDto updateItemQuantity(Long userId, Long productId, Integer quantity);
    CartDto removeItemFromCart(Long userId, Long productId);
    void clearCart(Long userId);
}
