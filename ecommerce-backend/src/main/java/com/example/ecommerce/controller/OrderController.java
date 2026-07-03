package com.example.ecommerce.controller;

import com.example.ecommerce.dto.CheckoutRequest;
import com.example.ecommerce.dto.OrderDto;
import com.example.ecommerce.security.UserDetailsImpl;
import com.example.ecommerce.service.OrderService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderService orderService;

    @PostMapping
    public ResponseEntity<OrderDto> createOrder(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @Valid @RequestBody CheckoutRequest checkoutRequest) {
        return new ResponseEntity<>(orderService.createOrder(userDetails.getId(), checkoutRequest), HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<OrderDto>> getMyOrders(@AuthenticationPrincipal UserDetailsImpl userDetails) {
        return ResponseEntity.ok(orderService.getOrdersOfUser(userDetails.getId()));
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDto> getOrderById(
            @AuthenticationPrincipal UserDetailsImpl userDetails,
            @PathVariable Long id) {
        OrderDto order = orderService.getOrderById(id);
        
        // Ensure standard users can only view their own orders
        boolean isAdmin = userDetails.getAuthorities().stream()
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
        
        // Wait, OrderDto doesn't store userId directly, but we can verify order owner. Let's make sure it matches.
        // For security, let's fetch order and compare userId or trust the service layer if it verifies.
        // Let's implement ownership check by retrieving order:
        // We can check if order belongs to the user, or if the user is Admin.
        // Let's check using order service layer or just fetching:
        // Since getOrderById returns OrderDto, let's make sure that a user can only query their own orders unless they are Admin.
        // We can pass userId to getOrderById or verify it here. Let's verify by checking if the order belongs to the user:
        // A simple query check is perfect. Let's check in service or controller.
        // To be safe and clean, let's just make sure they own it.
        // We'll let user view the order if they are ADMIN or the order belongs to them.
        // Let's retrieve orders of user and check if this order id is in their list:
        if (!isAdmin) {
            boolean ownsOrder = orderService.getOrdersOfUser(userDetails.getId()).stream()
                    .anyMatch(o -> o.getId().equals(id));
            if (!ownsOrder) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }
        }
        
        return ResponseEntity.ok(order);
    }

    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @PutMapping("/{id}/status")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<OrderDto> updateOrderStatus(
            @PathVariable Long id,
            @RequestParam String status) {
        return ResponseEntity.ok(orderService.updateOrderStatus(id, status));
    }
}
