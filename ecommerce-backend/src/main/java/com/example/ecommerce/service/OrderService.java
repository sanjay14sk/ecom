package com.example.ecommerce.service;

import com.example.ecommerce.dto.CheckoutRequest;
import com.example.ecommerce.dto.OrderDto;
import java.util.List;

public interface OrderService {
    OrderDto createOrder(Long userId, CheckoutRequest checkoutRequest);
    List<OrderDto> getOrdersOfUser(Long userId);
    OrderDto getOrderById(Long orderId);
    List<OrderDto> getAllOrders();
    OrderDto updateOrderStatus(Long orderId, String status);
}
