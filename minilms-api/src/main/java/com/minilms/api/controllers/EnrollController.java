package com.minilms.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minilms.api.config.responseApi.ApiResponse;
import com.minilms.api.config.responseApi.ResponseHandler;
import com.minilms.api.dto.inscription.InscriptionDTO;
import com.minilms.api.dto.inscription.InscriptionProgressDTO;
import com.minilms.api.dto.inscription.UpdateTimeSpentDTO;
import com.minilms.api.services.EnrollService;

import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/enroll")
@CrossOrigin(origins = {"http://localhost:4200", "https://minilms-frontend.onrender.com"})
@RequiredArgsConstructor
@Tag(name = "Inscripciones y Progreso", description = "Endpoints para la inscripción de estudiantes y seguimiento del progreso.")
public class EnrollController {

    private final EnrollService enrollService;

    @Operation(summary = "Inscribir estudiante a un curso (Rol: ESTUDIANTE)", description = "Crea un registro de inscripción vinculando al estudiante (obtenido del token de seguridad) con un curso. El 'estudianteId' en el DTO se ignora.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Inscripción exitosa", content = @Content(mediaType = "application/json", schema = @Schema(implementation = InscriptionDTO.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Datos inválidos (ej. ya está inscrito, o el curso no existe)", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = "{\"status\": 400, \"message\": \"El estudiante ya está inscrito en este curso\"}"))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Acceso denegado (No es ESTUDIANTE)")
    })
    @PostMapping("/")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<ApiResponse<InscriptionDTO>> inscriptionCourse(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "DTO de Inscripción. El 'estudianteId' se ignora (se toma del token), 'cursoId' es obligatorio.", required = true, content = @Content(schema = @Schema(implementation = InscriptionDTO.class))) @RequestBody InscriptionDTO dto) {
        return ResponseHandler.generateResponse(enrollService.inscriptionCourse(dto));
    }

    @Operation(summary = "Marcar lección como completada (Rol: ESTUDIANTE)", description = "Actualiza el progreso de una lección para el estudiante logueado. Esto recalcula el progreso total del curso en la inscripción.", security = @SecurityRequirement(name = "bearerAuth")

    )
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Lección marcada exitosamente", content = @Content(mediaType = "application/json", schema = @Schema(implementation = InscriptionProgressDTO.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "No se encontró la inscripción o la lección"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Acceso denegado (No es ESTUDIANTE)")
    })
    @PostMapping("/markLesson")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<ApiResponse<InscriptionProgressDTO>> markLesson(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "DTO de Progreso. 'leccionId' y 'cursoId' (para encontrar la inscripción) son obligatorios.", required = true, content = @Content(schema = @Schema(implementation = InscriptionProgressDTO.class))) @RequestBody InscriptionProgressDTO dto) {
        return ResponseHandler.generateResponse(enrollService.markLesson(dto));
    }

    @Operation(summary = "Actualizar tiempo dedicado a una lección (Rol: ESTUDIANTE)", description = "Actualiza el tiempo dedicado por el estudiante en una lección específica. El tiempo se suma al tiempo ya registrado.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Tiempo actualizado exitosamente", content = @Content(mediaType = "application/json", schema = @Schema(implementation = InscriptionProgressDTO.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "No se encontró la inscripción o la lección"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Acceso denegado (No es ESTUDIANTE)")
    })
    @PostMapping("/courses/{cursoId}/time-spent")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<ApiResponse<InscriptionProgressDTO>> updateTimeSpent(
            @PathVariable Long cursoId,
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "DTO con el ID de la lección y el tiempo dedicado en segundos", required = true, content = @Content(schema = @Schema(implementation = UpdateTimeSpentDTO.class))) @Valid @RequestBody UpdateTimeSpentDTO dto) {
        return ResponseHandler.generateResponse(enrollService.updateTimeSpent(cursoId, dto));
    }

    @Operation(summary = "Obtener tiempo total dedicado a un curso (Rol: ESTUDIANTE)", description = "Retorna el tiempo total en segundos que el estudiante ha dedicado a todas las lecciones de un curso.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Tiempo total obtenido exitosamente", content = @Content(mediaType = "application/json")),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "No se encontró la inscripción"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Acceso denegado (No es ESTUDIANTE)")
    })
    @GetMapping("/courses/{cursoId}/total-time")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<ApiResponse<Long>> getTotalTimeSpent(@PathVariable Long cursoId) {
        return ResponseHandler.generateResponse(enrollService.getTotalTimeSpentInCourse(cursoId));
    }

    @Operation(summary = "Obtener cursos inscritos del estudiante (Rol: ESTUDIANTE)", description = "Retorna todos los cursos en los que el estudiante autenticado está inscrito, con su progreso e información del curso.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Lista de cursos obtenida exitosamente", content = @Content(mediaType = "application/json")),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Acceso denegado (No es ESTUDIANTE)")
    })
    @GetMapping("/my-courses")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<ApiResponse<java.util.List<com.minilms.api.dto.course.CourseDTO>>> getMyCourses() {
        return ResponseHandler.generateResponse(enrollService.findCourses());
    }
}