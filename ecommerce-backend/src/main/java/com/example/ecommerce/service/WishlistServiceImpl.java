package com.example.ecommerce.service;

import com.example.ecommerce.dto.ProductDto;
import com.example.ecommerce.exception.ResourceNotFoundException;
import com.example.ecommerce.model.Product;
import com.example.ecommerce.model.User;
import com.example.ecommerce.model.Wishlist;
import com.example.ecommerce.repository.ProductRepository;
import com.example.ecommerce.repository.UserRepository;
import com.example.ecommerce.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    private Wishlist getOrCreateWishlist(Long userId) {
        return wishlistRepository.findByUserId(userId).orElseGet(() -> {
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
            Wishlist wishlist = new Wishlist(user);
            return wishlistRepository.save(wishlist);
        });
    }

    @Override
    public List<ProductDto> getWishlist(Long userId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        return wishlist.getProducts().stream()
                .map(this::mapToProductDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> addProductToWishlist(Long userId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        wishlist.getProducts().add(product);
        Wishlist savedWishlist = wishlistRepository.save(wishlist);
        return savedWishlist.getProducts().stream()
                .map(this::mapToProductDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<ProductDto> removeProductFromWishlist(Long userId, Long productId) {
        Wishlist wishlist = getOrCreateWishlist(userId);
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        wishlist.getProducts().remove(product);
        Wishlist savedWishlist = wishlistRepository.save(wishlist);
        return savedWishlist.getProducts().stream()
                .map(this::mapToProductDto)
                .collect(Collectors.toList());
    }

    private ProductDto mapToProductDto(Product product) {
        return new ProductDto(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock(),
                product.getImageUrl(),
                product.getCategory().getId(),
                product.getCategory().getName()
        );
    }
}
