package com.internship.tool.controller;

import com.internship.tool.config.JwtUtil;
import java.util.Map;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    @PostMapping("/login")
    public Map<String, String> login(@RequestBody Map<String, String> request) {
        String username = request.get("username");
        String password = request.get("password");

        String expectedUsername = System.getenv().getOrDefault("APP_USERNAME", "admin");
        String expectedPassword = System.getenv().getOrDefault("APP_PASSWORD", "admin");

        if (expectedUsername.equals(username) && expectedPassword.equals(password)) {
            return Map.of("token", JwtUtil.generateToken(username));
        }

        throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
    }
}
