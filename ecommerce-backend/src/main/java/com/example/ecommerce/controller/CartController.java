package com.example.ecommerce.controller;

import com.example.ecommerce.dto.CartDto;
import com.example.ecommerce.dto.MessageResponse;
import com.example.ecommerce.security.UserDetailsImpl;
import com.example.ecommerce.service.CartService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<CartDto> getCart(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(cartService.getCartOfUser(userDetails.getId()));
    }

    @PostMapping("/add")
    public ResponseEntity<CartDto> addItemToCart(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam Long productId,
            @RequestParam(defaultValue = "1") Integer quantity) {
        return ResponseEntity.ok(cartService.addItemToCart(userDetails.getId(), productId, quantity));
    }

    @PutMapping("/update")
    public ResponseEntity<CartDto> updateItemQuantity(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam Long productId,
            @RequestParam Integer quantity) {
        return ResponseEntity.ok(cartService.updateItemQuantity(userDetails.getId(), productId, quantity));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<CartDto> removeItemFromCart(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @RequestParam Long productId) {
        return ResponseEntity.ok(cartService.removeItemFromCart(userDetails.getId(), productId));
    }

    @DeleteMapping("/clear")
    public ResponseEntity<MessageResponse> clearCart(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        cartService.clearCart(userDetails.getId());
        return ResponseEntity.ok(new MessageResponse("Cart cleared successfully"));
    }
}
