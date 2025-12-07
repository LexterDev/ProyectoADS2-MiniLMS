package com.minilms.api.controllers;

import java.util.List;
import java.util.Optional;

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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.minilms.api.config.responseApi.ApiResponse;
import com.minilms.api.config.responseApi.PageResponse;
import com.minilms.api.config.responseApi.ResponseHandler;
import com.minilms.api.dto.course.CourseCreationBatchDTO;
import com.minilms.api.dto.course.CourseDTO;
import com.minilms.api.dto.course.LessonDTO;
import com.minilms.api.dto.course.SectionDTO;
import com.minilms.api.services.CourseService;

import jakarta.validation.Valid;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.ExampleObject;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = {"http://localhost:4200", "https://minilms-frontend.onrender.com", "https://minilms-front.onrender.com"})
@RequiredArgsConstructor
@Tag(name = "Cursos", description = "Endpoints para la gestión de Cursos, Secciones y Lecciones")
public class CourseController {

    private final CourseService courseService;

    @Operation(summary = "Listar cursos paginados", description = "Obtiene una lista paginada de todos los cursos, con filtro opcional por título o descripción.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Lista paginada de cursos", content = @Content(mediaType = "application/json", schema = @Schema(implementation = PageResponse.class)))
    })
    @GetMapping("/findAll")
    public ResponseEntity<ApiResponse<PageResponse<CourseDTO>>> findCourses(
            @Parameter(description = "Término de búsqueda para filtrar por título o descripción", example = "Java") @RequestParam(required = false) String txt,
            @Parameter(description = "Número de página (0-indexado)", example = "0") @RequestParam(required = false, defaultValue = "0") int page,
            @Parameter(description = "Tamaño de la página", example = "10") @RequestParam(required = false, defaultValue = "10") int size) {
        return ResponseHandler.generateResponse(courseService.findCourses(Optional.ofNullable(txt), page, size));
    }

    @Operation(summary = "Listar cursos por categoría", description = "Obtiene una lista de todos los cursos que pertenecen a una categoría específica.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Lista de cursos de la categoría", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CourseDTO.class)))
    })
    @GetMapping("/findByCategory")
    public ResponseEntity<ApiResponse<List<CourseDTO>>> findCoursesByCategory(
            @Parameter(description = "ID de la categoría para filtrar", required = true, example = "1") @RequestParam Long categoryId) {
        return ResponseHandler.generateResponse(courseService.findCoursesByCategory(categoryId));
    }

    @Operation(summary = "Listar cursos por instructor", description = "Obtiene una lista de todos los cursos creados por un instructor específico.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Lista de cursos del instructor", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CourseDTO.class)))
    })
    @GetMapping("/findByInstructor")
    public ResponseEntity<ApiResponse<List<CourseDTO>>> findCoursesByInstructor(
            @Parameter(description = "ID del instructor (usuario)", required = true, example = "2") @RequestParam Long instructorId) {
        return ResponseHandler.generateResponse(courseService.findCoursesByInstructor(instructorId));
    }

    @Operation(summary = "Obtener detalles de un curso", description = "Obtiene la información completa de un curso, incluyendo sus secciones y lecciones.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Detalles del curso", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CourseDTO.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Curso no encontrado")
    })
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseDTO>> getDetails(
            @Parameter(description = "ID del curso a obtener", required = true, example = "1") @PathVariable Long id) {
        return ResponseHandler.generateResponse(courseService.getDetails(id));
    }

    @Operation(summary = "Crear un nuevo curso (Rol: INSTRUCTOR)", description = "Crea un nuevo curso. El instructor se asigna automáticamente desde el token de seguridad. El estado inicial es 'BORRADOR'.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Curso creado exitosamente", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CourseDTO.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Datos de entrada inválidos (ej. categoría no existe)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Acceso denegado (No es INSTRUCTOR)")
    })
    @PostMapping("/create")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<CourseDTO>> createCourse(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos del curso a crear. El 'id' se ignora.", required = true, content = @Content(schema = @Schema(implementation = CourseDTO.class))) @RequestBody CourseDTO dto) {
        return ResponseHandler.generateResponse(courseService.createCourse(dto));
    }

    @Operation(summary = "Crear curso completo en batch (Rol: INSTRUCTOR)", description = "Crea un curso completo con sus secciones y lecciones en una sola petición. Ideal para el wizard de creación.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Curso creado exitosamente con todas sus secciones y lecciones", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CourseDTO.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Datos de entrada inválidos (ej. categoría no existe, orden duplicado)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Acceso denegado (No es INSTRUCTOR)")
    })
    @PostMapping("/create-batch")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<CourseDTO>> createCourseBatch(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos completos del curso con secciones y lecciones", required = true, content = @Content(schema = @Schema(implementation = CourseCreationBatchDTO.class))) @Valid @RequestBody CourseCreationBatchDTO batchDTO) {
        return ResponseHandler.generateResponse(courseService.createCourseBatch(batchDTO));
    }

    @Operation(summary = "Crear una nueva sección (Rol: INSTRUCTOR)", description = "Crea una nueva sección para un curso existente.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Sección creada exitosamente", content = @Content(mediaType = "application/json", schema = @Schema(implementation = SectionDTO.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Datos inválidos (ej. curso no existe, orden duplicado)", content = @Content(mediaType = "application/json", examples = @ExampleObject(name = "Error Orden Duplicado", value = "{\"status\": 400, \"message\": \"La posicion 1 ya esta asignada\"}"))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    @PostMapping("/createSection")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<SectionDTO>> createCourseSection(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos de la sección. 'cursoId' es obligatorio.", required = true, content = @Content(schema = @Schema(implementation = SectionDTO.class))) @RequestBody SectionDTO dto) {
        return ResponseHandler.generateResponse(courseService.createCourseSection(dto));
    }

    @Operation(summary = "Crear una nueva lección (Rol: INSTRUCTOR)", description = "Crea una nueva lección para una sección existente.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "201", description = "Lección creada exitosamente", content = @Content(mediaType = "application/json", schema = @Schema(implementation = LessonDTO.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "400", description = "Datos inválidos (ej. sección no existe, orden duplicado)"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    @PostMapping("/createLesson")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<LessonDTO>> createCourseLesson(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos de la lección. 'seccionId' es obligatorio.", required = true, content = @Content(schema = @Schema(implementation = LessonDTO.class))) @RequestBody LessonDTO dto) {
        return ResponseHandler.generateResponse(courseService.createCourseLesson(dto));
    }

    @Operation(summary = "Actualizar un curso (Rol: INSTRUCTOR)", description = "Actualiza los detalles de un curso existente por su ID.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Curso actualizado exitosamente", content = @Content(mediaType = "application/json", schema = @Schema(implementation = CourseDTO.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Curso no encontrado"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    @PutMapping("/update")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<CourseDTO>> updateCourse(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos del curso a actualizar. El 'id' del curso es obligatorio.", required = true) @RequestBody CourseDTO dto) {
        return ResponseHandler.generateResponse(courseService.updateCourse(dto));
    }

    @Operation(summary = "Actualizar una sección (Rol: INSTRUCTOR)", description = "Actualiza los detalles de una sección existente por su ID.", security = @SecurityRequirement(name = "bearerAuth"))
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Sección actualizada exitosamente", content = @Content(mediaType = "application/json", schema = @Schema(implementation = SectionDTO.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Sección no encontrada"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    @PutMapping("/updateSection")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<SectionDTO>> updateCourseSection(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos de la sección a actualizar. El 'id' de la sección es obligatorio.", required = true) @RequestBody SectionDTO dto) {
        return ResponseHandler.generateResponse(courseService.updateCourseSection(dto));
    }

    @Operation(summary = "Actualizar una lección (Rol: INSTRUCTOR)", description = "Actualiza los detalles de una lección existente por su ID.")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Lección actualizada exitosamente", content = @Content(mediaType = "application/json", schema = @Schema(implementation = LessonDTO.class))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Lección no encontrada"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    @PutMapping("/updateLesson")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<LessonDTO>> updateCourseLesson(
            @io.swagger.v3.oas.annotations.parameters.RequestBody(description = "Datos de la lección a actualizar. El 'id' de la lección es obligatorio.", required = true) @RequestBody LessonDTO dto) {
        return ResponseHandler.generateResponse(courseService.updateCourseLesson(dto));
    }

    @Operation(summary = "Eliminar un curso (Soft Delete) (Rol: INSTRUCTOR)", description = "Realiza un borrado lógico de un curso (lo marca como eliminado).")
    @ApiResponses(value = {
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "200", description = "Curso eliminado exitosamente", content = @Content(mediaType = "application/json", examples = @ExampleObject(value = "{\"status\": 200, \"message\": \"Operación realizada con éxito\", \"data\": \"Curso 'Java 21' eliminado con exito\"}"))),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "404", description = "Curso no encontrado"),
            @io.swagger.v3.oas.annotations.responses.ApiResponse(responseCode = "403", description = "Acceso denegado")
    })
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<String>> deleteCourse(
            @Parameter(description = "ID del curso a eliminar (borrado lógico)", required = true, example = "1") @PathVariable Long id) {
        return ResponseHandler.generateResponse(courseService.deleteCourse(id));
    }

}