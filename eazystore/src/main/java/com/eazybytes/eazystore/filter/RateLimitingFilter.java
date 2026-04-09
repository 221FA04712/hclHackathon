package com.eazybytes.eazystore.filter;

import io.github.bucket4j.Bandwidth;
import io.github.bucket4j.Bucket;
import io.github.bucket4j.Refill;
import jakarta.servlet.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class RateLimitingFilter implements Filter {

    private final Map<String, Bucket> cache = new ConcurrentHashMap<>();

    private Bucket createNewBucket() {
        Bandwidth limit = Bandwidth.classic(50, Refill.greedy(50, Duration.ofMinutes(1)));
        return Bucket.builder().addLimit(limit).build();
    }

    public Bucket resolveBucket(String ip) {
        return cache.computeIfAbsent(ip, k -> createNewBucket());
    }

    @Override
    public void doFilter(ServletRequest servletRequest, ServletResponse servletResponse, FilterChain filterChain) throws IOException, ServletException {
        HttpServletRequest request = (HttpServletRequest) servletRequest;
        HttpServletResponse response = (HttpServletResponse) servletResponse;

        if (request.getRequestURI().startsWith("/api/")) {
            String ip = request.getRemoteAddr();
            Bucket bucket = resolveBucket(ip);

            if (bucket.tryConsume(1)) {
                filterChain.doFilter(servletRequest, servletResponse);
            } else {
                response.setStatus(429); // Too Many Requests
                response.getWriter().write("Too many requests. Please try again later.");
            }
        } else {
            filterChain.doFilter(servletRequest, servletResponse);
        }
    }
}
