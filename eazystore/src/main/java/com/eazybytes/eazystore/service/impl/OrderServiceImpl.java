package com.eazybytes.eazystore.service.impl;

import com.eazybytes.eazystore.constants.ApplicationConstants;
import com.eazybytes.eazystore.dto.OrderItemReponseDto;
import com.eazybytes.eazystore.dto.OrderRequestDto;
import com.eazybytes.eazystore.dto.OrderResponseDto;
import com.eazybytes.eazystore.entity.Customer;
import com.eazybytes.eazystore.entity.Order;
import com.eazybytes.eazystore.entity.OrderItem;
import com.eazybytes.eazystore.entity.Product;
import com.eazybytes.eazystore.exception.ResourceNotFoundException;
import com.eazybytes.eazystore.repository.OrderRepository;
import com.eazybytes.eazystore.repository.ProductRepository;
import com.eazybytes.eazystore.repository.CustomerRepository;
import com.eazybytes.eazystore.service.IEmailService;
import com.eazybytes.eazystore.service.IOrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class OrderServiceImpl implements IOrderService {

    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final CustomerRepository customerRepository;
    private final ProfileServiceImpl profileService;
    private final IEmailService emailService;

    @Transactional
    @Override
    public void createOrder(OrderRequestDto orderRequest) {
        Customer customer = profileService.getAuthenticatedCustomer();

        // Loyalty Points Logic
        int pointsToRedeem = orderRequest.pointsToRedeem() != null ? orderRequest.pointsToRedeem() : 0;
        int currentPoints = customer.getLoyaltyPoints() != null ? customer.getLoyaltyPoints() : 0;
        if (pointsToRedeem > currentPoints) {
            throw new IllegalStateException("Insufficient loyalty points to redeem.");
        }
        
        // Calculate points earned (1 point per $1 spent based on the price)
        int pointsEarned = orderRequest.totalPrice().intValue();
        
        // Update points
        customer.setLoyaltyPoints(currentPoints - pointsToRedeem + pointsEarned);
        customerRepository.save(customer);

        // Create Order
        Order order = new Order();
        order.setCustomer(customer);
        BeanUtils.copyProperties(orderRequest, order);
        order.setOrderStatus(ApplicationConstants.ORDER_STATUS_CREATED);
        order.setPointsEarned(pointsEarned);
        order.setPointsRedeemed(pointsToRedeem);
        // Map OrderItems
        List<OrderItem> orderItems = orderRequest.items().stream().map(item -> {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrder(order);
            Product product = productRepository.findById(item.productId())
                    .orElseThrow(() -> new ResourceNotFoundException("Product", "ProductID",
                            item.productId().toString()));
            if (product.getAvailableQuantity() < item.quantity()) {
                throw new IllegalStateException("Not enough quantity available for Product: " + product.getName());
            }
            product.setAvailableQuantity(product.getAvailableQuantity() - item.quantity());
            productRepository.save(product);

            orderItem.setProduct(product);
            orderItem.setQuantity(item.quantity());
            orderItem.setPrice(item.price());
            return orderItem;
        }).collect(Collectors.toList());
        order.setOrderItems(orderItems);
        orderRepository.save(order);
        
        emailService.sendOrderConfirmation(customer, order);

    }

    @Override
    public List<OrderResponseDto> getCustomerOrders() {
        Customer customer =profileService.getAuthenticatedCustomer();
        List<Order> orders = orderRepository.findOrdersByCustomerWithNativeQuery(customer.getCustomerId());
        return orders.stream().map(this::mapToOrderResponseDTO).collect(Collectors.toList());
    }

    @Override
    public List<OrderResponseDto> getAllPendingOrders() {
        List<Order> orders = orderRepository.findOrdersByStatusWithNativeQuery(ApplicationConstants.ORDER_STATUS_CREATED);
        return orders.stream().map(this::mapToOrderResponseDTO).collect(Collectors.toList());
    }

    @Transactional
    @Override
    public void updateOrderStatus(Long orderId, String orderStatus) {
        Order order = orderRepository.findById(orderId).orElseThrow(
                () -> new ResourceNotFoundException("Order", "OrderID", orderId.toString())
        );

        // If order is being cancelled and it's not already cancelled
        if (ApplicationConstants.ORDER_STATUS_CANCELLED.equals(orderStatus) && !ApplicationConstants.ORDER_STATUS_CANCELLED.equals(order.getOrderStatus())) {
            Customer customer = order.getCustomer();
            int currentPoints = customer.getLoyaltyPoints() != null ? customer.getLoyaltyPoints() : 0;
            int pointsEarned = order.getPointsEarned() != null ? order.getPointsEarned() : 0;
            int pointsRedeemed = order.getPointsRedeemed() != null ? order.getPointsRedeemed() : 0;
            
            // Revert loyalty points
            customer.setLoyaltyPoints(currentPoints - pointsEarned + pointsRedeemed);
            customerRepository.save(customer);
            
            // Return stock
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                product.setAvailableQuantity(product.getAvailableQuantity() + item.getQuantity());
                productRepository.save(product);
            }
        }

        order.setOrderStatus(orderStatus);
        orderRepository.save(order);
        
        if (ApplicationConstants.ORDER_STATUS_CONFIRMED.equals(orderStatus)) {
            emailService.sendOrderConfirmation(order.getCustomer(), order);
        }
    }

    /**
     * Map Order entity to OrderResponseDto
     */
    private OrderResponseDto mapToOrderResponseDTO(Order order) {
        // Map Order Items
        List<OrderItemReponseDto> itemDTOs = order.getOrderItems().stream()
                .map(this::mapToOrderItemResponseDTO)
                .collect(Collectors.toList());
        OrderResponseDto orderResponseDto = new OrderResponseDto(order.getOrderId()
                , order.getOrderStatus(), order.getTotalPrice(), order.getCreatedAt().toString()
                , itemDTOs);
        return orderResponseDto;
    }

    /**
     * Map OrderItem entity to OrderItemResponseDto
     */
    private OrderItemReponseDto mapToOrderItemResponseDTO(OrderItem orderItem) {
        OrderItemReponseDto itemDTO = new OrderItemReponseDto(
                orderItem.getProduct().getId(), orderItem.getProduct().getName(), orderItem.getQuantity(),
                orderItem.getPrice(), orderItem.getProduct().getImageUrl());
        return itemDTO;
    }
}
