package com.minilms.api.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minilms.api.config.responseApi.ApiResponse;
import com.minilms.api.config.responseApi.ResponseHandler;
import com.minilms.api.dto.catalog.CategoryDTO;
import com.minilms.api.services.CategoryService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = {"http://localhost:4200", "https://minilms-frontend.onrender.com"})
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryService categoryService;

    @Operation(summary = "Listar todas las categorías", description = "Obtiene la lista completa de todas las categorías de cursos.", security = @SecurityRequirement(name = "bearerAuth"))
    @RequestMapping("/findAll")
    public ResponseEntity<ApiResponse<List<CategoryDTO>>> findCategories() {
        return ResponseHandler.generateResponse(categoryService.findAll());
    }

}
