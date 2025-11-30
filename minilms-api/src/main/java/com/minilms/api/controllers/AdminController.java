package com.minilms.api.controllers;

import com.minilms.api.dto.admin.AdminStatsDTO;
import com.minilms.api.dto.admin.CreateUserRequest;
import com.minilms.api.config.responseApi.ApiResponse;
import com.minilms.api.config.responseApi.ResponseHandler;
import com.minilms.api.entities.Estado;
import com.minilms.api.entities.User;
import com.minilms.api.services.AdminService;
import com.minilms.api.repository.UserRepository;
import com.minilms.api.repository.EstadoRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201", "https://minilms-frontend.onrender.com"})
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;
    private final EstadoRepository estadoRepository;

    @GetMapping("/stats")
    public ResponseEntity<ApiResponse<AdminStatsDTO>> getAdminStats() {
        AdminStatsDTO stats = adminService.getAdminStats();
        return ResponseHandler.success(stats, "Estadísticas obtenidas exitosamente", HttpStatus.OK);
    }

    @GetMapping("/users")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        List<User> users = userRepository.findAll();
        return ResponseHandler.success(users, "Usuarios obtenidos exitosamente", HttpStatus.OK);
    }

    @PostMapping("/users")
    public ResponseEntity<ApiResponse<User>> createUser(@Valid @RequestBody CreateUserRequest request) {
        User newUser = adminService.createUser(request);
        return ResponseHandler.success(newUser, "Usuario creado exitosamente", HttpStatus.CREATED);
    }

    @PatchMapping("/users/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        User user = userRepository.findById(id)
            .orElse(null);

        if (user == null) {
            return ResponseHandler.generateErrorResponse("Usuario no encontrado", HttpStatus.NOT_FOUND);
        }

        // Toggle between "ACT" and "INA" estados
        String newStatusCode = user.getEstado().getCodigo().equals("ACT") ? "INA" : "ACT";
        Estado newEstado = estadoRepository.findByCodigo(newStatusCode)
            .orElseThrow(() -> new RuntimeException("Estado no encontrado: " + newStatusCode));

        user.setEstado(newEstado);
        User updatedUser = userRepository.save(user);

        String message = newEstado.getCodigo().equals("ACT")
            ? "Usuario activado exitosamente"
            : "Usuario desactivado exitosamente";

        return ResponseHandler.success(updatedUser, message, HttpStatus.OK);
    }
}
