package com.eazybytes.eazystore.controller;

import com.eazybytes.eazystore.constants.ApplicationConstants;

import com.eazybytes.eazystore.dto.OrderResponseDto;
import com.eazybytes.eazystore.dto.ProductDto;
import com.eazybytes.eazystore.dto.ResponseDto;

import com.eazybytes.eazystore.service.IOrderService;
import com.eazybytes.eazystore.service.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final IOrderService iOrderService;
    private final IProductService iProductService;

    @GetMapping("/orders")
    public ResponseEntity<List<OrderResponseDto>> getAllPendingOrders() {
        return ResponseEntity.ok().body(iOrderService.getAllPendingOrders());
    }

    @PatchMapping("/orders/{orderId}/confirm")
    public ResponseEntity<ResponseDto> confirmOrder(@PathVariable("orderId") Long orderId) {
        iOrderService.updateOrderStatus(orderId, ApplicationConstants.ORDER_STATUS_CONFIRMED);
        return ResponseEntity.ok(
                new ResponseDto("200", "Order #" + orderId + " has been approved.")
        );
    }

    @PatchMapping("/orders/{orderId}/cancel")
    public ResponseEntity<ResponseDto> cancelOrder(@PathVariable("orderId") Long orderId) {
        iOrderService.updateOrderStatus(orderId, ApplicationConstants.ORDER_STATUS_CANCELLED);
        return ResponseEntity.ok(
                new ResponseDto("200", "Order #" + orderId + " has been cancelled.")
        );
    }



    @PostMapping("/products")
    public ResponseEntity<ProductDto> createProduct(@RequestBody ProductDto productDto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(iProductService.createProduct(productDto));
    }

    @PutMapping("/products/{productId}")
    public ResponseEntity<ProductDto> updateProduct(@PathVariable("productId") Long productId, @RequestBody ProductDto productDto) {
        return ResponseEntity.ok(iProductService.updateProduct(productId, productDto));
    }

}
