package com.eazybytes.eazystore.controller;

import com.eazybytes.eazystore.entity.Coupon;
import com.eazybytes.eazystore.repository.CouponRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/v1/coupons")
@RequiredArgsConstructor
public class CouponController {

    private final CouponRepository couponRepository;

    @GetMapping("/validate")
    public ResponseEntity<?> validateCoupon(@RequestParam String code) {
        Optional<Coupon> coupon = couponRepository.findByCode(code.trim().toUpperCase());
        if (coupon.isPresent() && coupon.get().getIsActive()) {
            return ResponseEntity.ok(coupon.get());
        } else {
            return ResponseEntity.badRequest().body("Invalid or expired coupon code.");
        }
    }
}
