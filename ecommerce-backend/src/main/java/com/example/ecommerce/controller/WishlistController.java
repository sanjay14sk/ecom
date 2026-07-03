package com.example.ecommerce.controller;

import com.example.ecommerce.dto.ProductDto;
import com.example.ecommerce.security.UserDetailsImpl;
import com.example.ecommerce.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<ProductDto>> getWishlist(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(wishlistService.getWishlist(userDetails.getId()));
    }

    @PostMapping("/add")
    public ResponseEntity<List<ProductDto>> addProductToWishlist(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam Long productId) {
        return ResponseEntity.ok(wishlistService.addProductToWishlist(userDetails.getId(), productId));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<List<ProductDto>> removeProductFromWishlist(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam Long productId) {
        return ResponseEntity.ok(wishlistService.removeProductFromWishlist(userDetails.getId(), productId));
    }
}
