package com.minilms.api.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minilms.api.config.responseApi.ApiResponse;
import com.minilms.api.config.responseApi.ResponseHandler;
import com.minilms.api.dto.course.CourseDTO;
import com.minilms.api.services.EnrollService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = {"http://localhost:4200", "https://minilms-frontend.onrender.com"})
@RequiredArgsConstructor
@Tag(name = "Estudiante", description = "Endpoints para el panel de Estudiantes.")
public class StudentController {

    private final EnrollService service;

    @Operation(summary = "Dashboard del Estudiante (Rol: ESTUDIANTE)", description = "Obtiene la lista de todos los cursos en los que el estudiante (obtenido del token de seguridad) está inscrito actualmente.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Lista de cursos inscritos por el estudiante.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CourseDTO.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Acceso denegado (No tiene rol ESTUDIANTE)")
    })
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<ApiResponse<List<CourseDTO>>> findCourses() {
        return ResponseHandler.generateResponse(service.findCourses());
    }

}