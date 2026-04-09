package com.eazybytes.eazystore.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Getter
@Setter
@Entity
@Table(name = "COUPONS")
public class Coupon extends BaseEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "COUPON_ID", nullable = false)
    private Long id;

    @Column(name = "CODE", nullable = false, unique = true, length = 50)
    private String code;

    @Column(name = "DISCOUNT_PERCENTAGE", nullable = false, precision = 5, scale = 2)
    private BigDecimal discountPercentage;

    @Column(name = "IS_ACTIVE", nullable = false)
    private Boolean isActive = true;
}
