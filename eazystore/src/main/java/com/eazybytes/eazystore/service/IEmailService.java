package com.eazybytes.eazystore.service;

import com.eazybytes.eazystore.entity.Customer;
import com.eazybytes.eazystore.entity.Order;

public interface IEmailService {
    void sendOrderConfirmation(Customer customer, Order order);
}
