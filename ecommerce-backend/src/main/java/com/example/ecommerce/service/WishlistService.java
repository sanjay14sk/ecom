package com.example.ecommerce.service;

import com.example.ecommerce.dto.ProductDto;
import java.util.List;

public interface WishlistService {
    List<ProductDto> getWishlist(Long userId);
    List<ProductDto> addProductToWishlist(Long userId, Long productId);
    List<ProductDto> removeProductFromWishlist(Long userId, Long productId);
}
