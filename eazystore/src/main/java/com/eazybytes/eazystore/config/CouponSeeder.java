package com.eazybytes.eazystore.config;

import com.eazybytes.eazystore.entity.Coupon;
import com.eazybytes.eazystore.entity.Product;
import com.eazybytes.eazystore.repository.CouponRepository;
import com.eazybytes.eazystore.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class CouponSeeder implements CommandLineRunner {

    private final CouponRepository couponRepository;
    private final ProductRepository productRepository;

    @Override
    public void run(String... args) {
        log.info("Checking Database Seeding & Fixing Invalid Inventory States...");
        
        // 1. Seed Missing Coupons
        if (couponRepository.findByCode("WELCOME20").isEmpty()) {
            Coupon c = new Coupon();
            c.setCode("WELCOME20");
            c.setDiscountPercentage(new BigDecimal("20.00"));
            c.setIsActive(true);
            couponRepository.save(c);
        }
        if (couponRepository.findByCode("FREESHIP").isEmpty()) {
            Coupon c = new Coupon();
            c.setCode("FREESHIP");
            c.setDiscountPercentage(new BigDecimal("15.00"));
            c.setIsActive(true);
            couponRepository.save(c);
        }
        if (couponRepository.findByCode("PIZZA10").isEmpty()) {
            Coupon c = new Coupon();
            c.setCode("PIZZA10");
            c.setDiscountPercentage(new BigDecimal("10.00"));
            c.setIsActive(true);
            couponRepository.save(c);
        }

        // 2. Repair Missing Product Inventory
        List<Product> products = productRepository.findAll();
        for (Product p : products) {
            boolean changed = false;
            if (p.getAvailableQuantity() == null || p.getAvailableQuantity() <= 0) {
                p.setAvailableQuantity(50); // Give old products stock!
                changed = true;
            }
            if (p.getBrand() == null || p.getBrand().trim().isEmpty()) {
                p.setBrand("Eazy Retail");
                changed = true;
            }
            if (p.getCategory() == null || p.getCategory().trim().isEmpty()) {
                p.setCategory("Uncategorized");
                changed = true;
            }
            if (p.getPackaging() == null || p.getPackaging().trim().isEmpty()) {
                p.setPackaging("Standard");
                changed = true;
            }
            if (changed) {
                productRepository.save(p);
                log.info("Repaired legacy schema data for product: {}", p.getName());
            }
        }
    }
}
