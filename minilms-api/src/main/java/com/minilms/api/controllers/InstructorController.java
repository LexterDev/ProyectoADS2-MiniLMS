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
import com.minilms.api.services.CourseService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/instructor")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
@Tag(name = "Instructor", description = "Endpoints específicos para Instructores (Dashboard, etc.)")
public class InstructorController {

    private final CourseService service;

    @Operation(summary = "Dashboard del Instructor (Rol: INSTRUCTOR)", description = "Obtiene una lista de todos los cursos creados por el instructor actualmente logueado. El instructor se identifica a través del token de seguridad.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Operación realizada con éxito. Devuelve la lista de cursos del instructor.", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CourseDTO.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Acceso denegado (No tiene rol INSTRUCTOR)")
    })
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<List<CourseDTO>>> findCoursesByInstructor() {
        return ResponseHandler.generateResponse(service.findCoursesDashboardByInstructor());
    }

}