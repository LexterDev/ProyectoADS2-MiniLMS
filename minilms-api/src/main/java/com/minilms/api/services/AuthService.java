package com.minilms.api.services;

import com.minilms.api.config.responseApi.ApiException;
import com.minilms.api.dto.AuthResponse;
import com.minilms.api.dto.LoginRequest;
import com.minilms.api.dto.RegisterRequest;
import com.minilms.api.entities.Estado;
import com.minilms.api.entities.Rol;
import com.minilms.api.entities.User;
import com.minilms.api.enums.UserRole;
import com.minilms.api.repository.EstadoRepository;
import com.minilms.api.repository.RolRepository;
import com.minilms.api.repository.UserRepository;
import com.minilms.api.utils.JwtUtil;
import lombok.RequiredArgsConstructor;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RolRepository rolRepository;
    private final EstadoRepository estadoRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getCorreo(), request.getClave())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        User user = userRepository.findByCorreo(request.getCorreo()).orElseThrow();
        
        // CORREGIDO: Llamamos al nuevo método que creamos en JwtUtil
        String token = jwtUtil.generateTokenWithRole(user.getCorreo(), user.getRol().getCodigo());
        
        return new AuthResponse(token, user.getId(), user.getNombre(), user.getApellido(), user.getCorreo(), user.getRol().getCodigo());
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByCorreo(request.getCorreo())) {
            throw new ApiException("El correo "+ request.getCorreo() +" ya está en uso!", HttpStatus.BAD_REQUEST);
        }

        Rol userRole = rolRepository.findByCodigo(UserRole.Estudiante.getCodigo())
                .orElseThrow(() -> new ApiException("Aun no se ha ingresado un rol en el catalogo", HttpStatus.BAD_REQUEST));

        Estado activeState = estadoRepository.findByCodigo("ACT")
                .orElseThrow(() -> new ApiException("Aun no se ha ingresado un estado en el catalogo", HttpStatus.BAD_REQUEST));

        User user = new User();
        user.setNombre(request.getNombre());
        user.setApellido(request.getApellido());
        user.setCorreo(request.getCorreo());
        user.setClave(passwordEncoder.encode(request.getClave()));
        user.setRol(userRole);
        user.setEstado(activeState);

        User savedUser = userRepository.save(user);

        // CORREGIDO: Llamamos al nuevo método que creamos en JwtUtil
        String token = jwtUtil.generateTokenWithRole(savedUser.getCorreo(), savedUser.getRol().getCodigo());

        return new AuthResponse(token, savedUser.getId(), savedUser.getNombre(), savedUser.getApellido(), savedUser.getCorreo(), savedUser.getRol().getCodigo());
    }
}

