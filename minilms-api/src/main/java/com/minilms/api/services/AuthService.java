package com.minilms.api.services;

import com.minilms.api.dto.AuthResponse;
import com.minilms.api.dto.LoginRequest;
import com.minilms.api.dto.RegisterRequest;
import com.minilms.api.entities.User;
import com.minilms.api.enums.UserRole;
import com.minilms.api.repository.UserRepository;
import com.minilms.api.utils.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {
    
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    
    public AuthResponse login(LoginRequest loginRequest) throws Exception {
        // Autenticar usuario
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getEmail(), 
                loginRequest.getPassword()
            )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        
        // Generar JWT
        String jwt = jwtUtil.generateJwtToken(authentication);
        
        // Obtener datos del usuario
        User user = userRepository.findByEmail(loginRequest.getEmail())
            .orElseThrow(() -> new Exception("Usuario no encontrado"));
        
        return new AuthResponse(
            jwt, 
            user.getId(),
            user.getNombre(), 
            user.getApellido(),
            user.getEmail(), 
            user.getRol().name()
        );
    }
    
    public AuthResponse register(RegisterRequest registerRequest) throws Exception {
        // Verificar si el email ya existe
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new Exception("El email ya está en uso");
        }
        
        // Crear nuevo usuario
        User user = new User(
            registerRequest.getNombre(),
            registerRequest.getApellido(),
            registerRequest.getEmail(),
            passwordEncoder.encode(registerRequest.getPassword()),
            UserRole.valueOf(registerRequest.getRol().toUpperCase())
        );
        
        User savedUser = userRepository.save(user);
        
        // Generar JWT para el nuevo usuario
        String jwt = jwtUtil.generateTokenFromUsername(savedUser.getEmail());
        
        return new AuthResponse(
            jwt,
            savedUser.getId(),
            savedUser.getNombre(),
            savedUser.getApellido(),
            savedUser.getEmail(),
            savedUser.getRol().name()
        );
    }
}
