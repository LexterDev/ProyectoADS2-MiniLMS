package com.minilms.api.controllers;

import com.minilms.api.config.responseApi.ApiResponse;
import com.minilms.api.config.responseApi.ResponseHandler;
import com.minilms.api.dto.AuthResponse;
import com.minilms.api.dto.ForgotPasswordRequest;
import com.minilms.api.dto.LoginRequest;
import com.minilms.api.dto.MessageResponse;
import com.minilms.api.dto.RegisterRequest;
import com.minilms.api.dto.ResetPasswordRequest;
import com.minilms.api.services.AuthService;
import com.minilms.api.services.PasswordResetService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:4200", "https://minilms-frontend.onrender.com"}) // Para Angular
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final PasswordResetService passwordResetService;
    
    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            AuthResponse response = authService.login(loginRequest);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Error: " + e.getMessage()));
        }
    }
    
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<AuthResponse>> register(@Valid @RequestBody RegisterRequest registerRequest) {
        return ResponseHandler.generateResponse(authService.register(registerRequest));
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<ApiResponse<Map<String, String>>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        String token = passwordResetService.generatePasswordResetToken(request);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Si el correo existe en nuestro sistema, recibirás un enlace de recuperación");
        response.put("token", token); // In production, don't return the token - send it via email

        return ResponseHandler.success(response, "Solicitud procesada exitosamente", HttpStatus.OK);
    }

    @GetMapping("/validate-reset-token")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> validateResetToken(@RequestParam String token) {
        boolean isValid = passwordResetService.validatePasswordResetToken(token);

        Map<String, Boolean> response = new HashMap<>();
        response.put("valid", isValid);

        return ResponseHandler.success(response, isValid ? "Token válido" : "Token inválido o expirado", HttpStatus.OK);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<ApiResponse<Map<String, String>>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        passwordResetService.resetPassword(request);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Contraseña restablecida exitosamente");

        return ResponseHandler.success(response, "Contraseña restablecida exitosamente", HttpStatus.OK);
    }
}
