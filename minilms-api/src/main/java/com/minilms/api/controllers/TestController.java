package com.minilms.api.controllers;

import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.minilms.api.config.responseApi.ApiResponse;
import com.minilms.api.config.responseApi.ResponseHandler;
import com.minilms.api.services.DatabaseSeederService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = {"http://localhost:4200", "https://minilms-frontend.onrender.com"})
@RequiredArgsConstructor
public class TestController {
    private final DatabaseSeederService seederService;
    
    @GetMapping("/public")
    public String publicAccess() {
        return "¡Contenido público de Mini-LMS!";
    }
    
    @GetMapping("/user")
    @PreAuthorize("hasRole('ESTUDIANTE') or hasRole('INSTRUCTOR') or hasRole('ADMINISTRADOR')")
    public String userAccess() {
        return "¡Contenido de usuario autenticado!";
    }
    
    @GetMapping("/instructor")
    @PreAuthorize("hasRole('INSTRUCTOR') or hasRole('ADMINISTRADOR')")
    public String instructorAccess() {
        return "¡Contenido para instructores!";
    }
    
    @GetMapping("/admin")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public String adminAccess() {
        return "¡Contenido del administrador!";
    }

    @Operation(
        summary = "Resetear y Poblar Base de Datos",
        description = "Ejecuta un TRUNCATE en todas las tablas y vuelve a insertar los datos de prueba desde el archivo 'dataset_inicial.sql'.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Base de datos reseteada exitosamente."),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "500", description = "Error interno al ejecutar el script SQL.")
    })
    @PostMapping("/dataSeed")
    public ResponseEntity<ApiResponse<String>> seedDatabase() {
        return ResponseHandler.generateResponse(seederService.seedDatabase());
    }
}
