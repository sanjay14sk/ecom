package com.example.ecommerce;

import com.example.ecommerce.model.ERole;
import com.example.ecommerce.model.Role;
import com.example.ecommerce.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class EcommerceApplication {

    public static void main(String[] args) {
        SpringApplication.run(EcommerceApplication.class, args);
    }

    @Bean
    public CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {
            if (!roleRepository.findByName(ERole.ROLE_USER).isPresent()) {
                roleRepository.save(new Role(ERole.ROLE_USER));
            }
            if (!roleRepository.findByName(ERole.ROLE_ADMIN).isPresent()) {
                roleRepository.save(new Role(ERole.ROLE_ADMIN));
            }
        };
    }
}
