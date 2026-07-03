package com.example.ecommerce.service;

import com.example.ecommerce.dto.ProductDto;
import org.springframework.data.domain.Page;
import java.math.BigDecimal;

public interface ProductService {
    Page<ProductDto> getAllProducts(Long categoryId, String search, BigDecimal minPrice, BigDecimal maxPrice,
                                    int page, int size, String sortBy, String sortDir);
    ProductDto getProductById(Long id);
    ProductDto createProduct(ProductDto productDto);
    ProductDto updateProduct(Long id, ProductDto productDto);
    void deleteProduct(Long id);
}
