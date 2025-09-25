package com.minilms.api.controllers;

import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/test")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class TestController {
    
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
}
