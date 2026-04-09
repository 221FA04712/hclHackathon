package com.eazybytes.eazystore.service.impl;

import com.eazybytes.eazystore.entity.Customer;
import com.eazybytes.eazystore.entity.Order;
import com.eazybytes.eazystore.service.IEmailService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmailServiceImpl implements IEmailService {

    private final JavaMailSender javaMailSender;

    @Value("${spring.mail.username:noreply@eazystore.com}")
    private String fromEmail;

    @Override
    public void sendOrderConfirmation(Customer customer, Order order) {
        log.info("Preparing to send order confirmation email to {}", customer.getEmail());
        try {
            String subject = "Order Confirmation - " + order.getOrderId();
            StringBuilder textBuilder = new StringBuilder();
            textBuilder.append("Dear ").append(customer.getName()).append(",\n\n");
            textBuilder.append("Thank you for your order!\n\n");
            textBuilder.append("--- Payment Details ---\n");
            textBuilder.append("Payment ID: ").append(order.getPaymentId()).append("\n");
            textBuilder.append("Payment Status: ").append(order.getPaymentStatus()).append("\n");
            textBuilder.append("Total Price: $").append(order.getTotalPrice()).append("\n\n");

            textBuilder.append("--- Order Details ---\n");
            textBuilder.append("Order ID: ").append(order.getOrderId()).append("\n");
            if (order.getOrderItems() != null) {
                for (var item : order.getOrderItems()) {
                    textBuilder.append("- ").append(item.getProduct().getName())
                            .append(" (Qty: ").append(item.getQuantity())
                            .append(") - $").append(item.getPrice()).append("\n");
                }
            }

            textBuilder.append("\nYour items will be prepared and shipped shortly.\n\n");
            textBuilder.append("Best regards,\nEazy Retail Team");
            
            String text = textBuilder.toString();
            SimpleMailMessage message = new SimpleMailMessage();
            message.setFrom(fromEmail);
            message.setTo(customer.getEmail());
            message.setSubject(subject);
            message.setText(text);
            
            javaMailSender.send(message);
            
            log.info("Order confirmation email physically dispatched to {}", customer.getEmail());
        } catch (Exception e) {
            log.error("Failed to send email to {}. SMTP Settings may be missing or invalid.", customer.getEmail(), e);
        }
    }
}
