package com.eazybytes.eazystore.config;

import com.eazybytes.eazystore.entity.Customer;
import com.eazybytes.eazystore.entity.Role;
import com.eazybytes.eazystore.repository.CustomerRepository;
import com.eazybytes.eazystore.repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.Set;

@Component
@Slf4j
@RequiredArgsConstructor
public class AdminSeeder implements CommandLineRunner {

    private final CustomerRepository customerRepository;
    private final RoleRepository roleRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) {
        String adminEmail = "admin@eazystore.com";
        Optional<Customer> existingAdmin = customerRepository.findByEmailOrMobileNumber(adminEmail, "0000000000");

        if (existingAdmin.isEmpty()) {
            Customer admin = new Customer();
            admin.setName("System Admin");
            admin.setEmail(adminEmail);
            admin.setMobileNumber("0000000000");
            admin.setPasswordHash(passwordEncoder.encode("Admin7013")); // Default password

            Role adminRole = roleRepository.findByName("ROLE_ADMIN").orElseGet(() -> {
                Role newRole = new Role();
                newRole.setName("ROLE_ADMIN");
                return roleRepository.save(newRole);
            });

            Role userRole = roleRepository.findByName("ROLE_USER").orElseGet(() -> {
                Role newRole = new Role();
                newRole.setName("ROLE_USER");
                return roleRepository.save(newRole);
            });

            admin.setRoles(Set.of(adminRole, userRole));
            customerRepository.save(admin);
            log.info("✅ Admin user created successfully: {} / Admin7013", adminEmail);
        } else {
            log.info("✅ Admin user already exists: {}", adminEmail);
        }
    }
}
