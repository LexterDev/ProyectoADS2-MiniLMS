package com.minilms.api.controllers;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.minilms.api.config.responseApi.ApiResponse;
import com.minilms.api.config.responseApi.ResponseHandler;
import com.minilms.api.dto.catalog.CategoryDTO;
import com.minilms.api.services.CategoryService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = {"http://localhost:4200", "https://minilms-frontend.onrender.com"})
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "Listar todas las categorías", description = "Obtiene la lista completa de todas las categorías de cursos.")
    @GetMapping("/findAll")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> findCategories() {
        return ResponseHandler.generateResponse(categoryService.findAll());
    }

    @Operation(summary = "Listar categorías activas", description = "Obtiene solo las categorías activas.")
    @GetMapping("/active")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> findActiveCategories() {
        return ResponseHandler.generateResponse(categoryService.findActiveCategories());
    }

    @Operation(summary = "Obtener categoría por ID", description = "Obtiene una categoría específica por su ID.")
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> findById(@PathVariable Long id) {
        return ResponseHandler.generateResponse(categoryService.findById(id));
    }

    @Operation(summary = "Crear categoría", description = "Crea una nueva categoría de cursos.", security = @SecurityRequirement(name = "bearerAuth"))
    @PostMapping
    public ResponseEntity<ApiResponse<CategoryDTO>> createCategory(@Valid @RequestBody CategoryDTO categoryDTO) {
        CategoryDTO created = categoryService.create(categoryDTO);
        return ResponseHandler.generateResponse(created, HttpStatus.CREATED);
    }

    @Operation(summary = "Actualizar categoría", description = "Actualiza una categoría existente.", security = @SecurityRequirement(name = "bearerAuth"))
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<CategoryDTO>> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryDTO categoryDTO) {
        return ResponseHandler.generateResponse(categoryService.update(id, categoryDTO));
    }

    @Operation(summary = "Eliminar categoría", description = "Elimina una categoría (solo si no tiene cursos asociados).", security = @SecurityRequirement(name = "bearerAuth"))
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteCategory(@PathVariable Long id) {
        categoryService.delete(id);
        return ResponseHandler.generateResponse(null, HttpStatus.NO_CONTENT);
    }

    @Operation(summary = "Activar/Desactivar categoría", description = "Cambia el estado activo/inactivo de una categoría.", security = @SecurityRequirement(name = "bearerAuth"))
    @PatchMapping("/{id}/toggle-status")
    public ResponseEntity<ApiResponse<CategoryDTO>> toggleStatus(@PathVariable Long id) {
        return ResponseHandler.generateResponse(categoryService.toggleStatus(id));
    }

}
