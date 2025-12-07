package com.minilms.api.controllers;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minilms.api.config.responseApi.ApiResponse;
import com.minilms.api.config.responseApi.ResponseHandler;
import com.minilms.api.dto.course.ReviewDTO;
import com.minilms.api.services.ReviewService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:3000", "https://minilms-frontend.onrender.com", "https://minilms-front.onrender.com"})
@RequiredArgsConstructor
@Tag(name = "Reseñas", description = "Endpoints para la gestión de reseñas y calificaciones de cursos")
public class ReviewController {

    private final ReviewService reviewService;

    @Operation(
        summary = "Crear una reseña",
        description = "Permite a un estudiante inscrito crear una reseña para un curso. Solo se permite una reseña por estudiante por curso.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "201",
            description = "Reseña creada exitosamente",
            content = @Content(mediaType = "application/json", schema = @Schema(implementation = ApiResponse.class))
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "403",
            description = "Usuario no inscrito en el curso"
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "409",
            description = "El usuario ya ha dejado una reseña para este curso"
        )
    })
    @PostMapping
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<ApiResponse<ReviewDTO>> createReview(
            @Valid @RequestBody ReviewDTO reviewDTO) {
        ReviewDTO createdReview = reviewService.createReview(reviewDTO);
        return ResponseHandler.success(
            createdReview,
            "Reseña creada exitosamente",
            HttpStatus.CREATED
        );
    }

    @Operation(
        summary = "Actualizar una reseña",
        description = "Permite al autor actualizar su propia reseña.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Reseña actualizada exitosamente"
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "403",
            description = "No tiene permiso para actualizar esta reseña"
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Reseña no encontrada"
        )
    })
    @PutMapping("/{reviewId}")
    @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<ApiResponse<ReviewDTO>> updateReview(
            @Parameter(description = "ID de la reseña") @PathVariable Long reviewId,
            @Valid @RequestBody ReviewDTO reviewDTO) {
        ReviewDTO updatedReview = reviewService.updateReview(reviewId, reviewDTO);
        return ResponseHandler.success(
            updatedReview,
            "Reseña actualizada exitosamente",
            HttpStatus.OK
        );
    }

    @Operation(
        summary = "Eliminar una reseña",
        description = "Permite al autor o administrador eliminar una reseña.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Reseña eliminada exitosamente"
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "403",
            description = "No tiene permiso para eliminar esta reseña"
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Reseña no encontrada"
        )
    })
    @DeleteMapping("/{reviewId}")
    @PreAuthorize("hasAnyRole('ESTUDIANTE', 'ADMINISTRADOR')")
    public ResponseEntity<ApiResponse<Void>> deleteReview(
            @Parameter(description = "ID de la reseña") @PathVariable Long reviewId) {
        reviewService.deleteReview(reviewId);
        return ResponseHandler.success(
            null,
            "Reseña eliminada exitosamente",
            HttpStatus.OK
        );
    }

    @Operation(
        summary = "Obtener reseñas de un curso",
        description = "Obtiene todas las reseñas asociadas a un curso específico."
    )
    @ApiResponses(value = {
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "200",
            description = "Lista de reseñas del curso"
        ),
        @io.swagger.v3.oas.annotations.responses.ApiResponse(
            responseCode = "404",
            description = "Curso no encontrado"
        )
    })
    @GetMapping("/course/{cursoId}")
    public ResponseEntity<ApiResponse<List<ReviewDTO>>> getReviewsByCourse(
            @Parameter(description = "ID del curso") @PathVariable Long cursoId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByCourse(cursoId);
        return ResponseHandler.success(
            reviews,
            "Reseñas obtenidas exitosamente",
            HttpStatus.OK
        );
    }

    @Operation(
        summary = "Obtener reseñas de un usuario",
        description = "Obtiene todas las reseñas creadas por un usuario.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/user/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ReviewDTO>>> getReviewsByUser(
            @Parameter(description = "ID del usuario") @PathVariable Long userId) {
        List<ReviewDTO> reviews = reviewService.getReviewsByUser(userId);
        return ResponseHandler.success(
            reviews,
            "Reseñas del usuario obtenidas exitosamente",
            HttpStatus.OK
        );
    }

    @Operation(
        summary = "Obtener estadísticas de reseñas de un curso",
        description = "Obtiene el promedio de calificaciones y el número total de reseñas de un curso."
    )
    @GetMapping("/course/{cursoId}/stats")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCourseReviewStats(
            @Parameter(description = "ID del curso") @PathVariable Long cursoId) {
        Double averageRating = reviewService.getAverageRating(cursoId);
        Long reviewCount = reviewService.getReviewCount(cursoId);

        Map<String, Object> stats = new HashMap<>();
        stats.put("averageRating", averageRating);
        stats.put("reviewCount", reviewCount);

        return ResponseHandler.success(
            stats,
            "Estadísticas obtenidas exitosamente",
            HttpStatus.OK
        );
    }

    @Operation(
        summary = "Verificar si el usuario ha dejado una reseña",
        description = "Verifica si un usuario específico ya ha dejado una reseña para un curso.",
        security = @SecurityRequirement(name = "bearerAuth")
    )
    @GetMapping("/check/{cursoId}/{userId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<Map<String, Boolean>>> checkUserReview(
            @Parameter(description = "ID del curso") @PathVariable Long cursoId,
            @Parameter(description = "ID del usuario") @PathVariable Long userId) {
        boolean hasReviewed = reviewService.hasUserReviewedCourse(userId, cursoId);

        Map<String, Boolean> result = new HashMap<>();
        result.put("hasReviewed", hasReviewed);

        return ResponseHandler.success(
            result,
            "Verificación completada",
            HttpStatus.OK
        );
    }
}
