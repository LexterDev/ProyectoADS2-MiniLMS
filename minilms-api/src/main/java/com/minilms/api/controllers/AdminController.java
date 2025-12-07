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
import com.minilms.api.repository.CursoRepository;
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
@CrossOrigin(origins = {"http://localhost:4200", "http://localhost:4201", "https://minilms-frontend.onrender.com", "https://minilms-front.onrender.com"})
@PreAuthorize("hasRole('ADMINISTRADOR')")
public class AdminController {

    private final AdminService adminService;
    private final UserRepository userRepository;
    private final EstadoRepository estadoRepository;
    private final CursoRepository cursoRepository;

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
        User updatedUser = adminService.toggleUserStatus(id);
        String message = updatedUser.getEstado().getCodigo().equals("ACT")
            ? "Usuario activado exitosamente"
            : "Usuario desactivado exitosamente";
        return ResponseHandler.success(updatedUser, message, HttpStatus.OK);
    }

    @GetMapping("/courses")
    public ResponseEntity<ApiResponse<List<com.minilms.api.dto.course.CourseDTO>>> getAllCourses() {
        List<com.minilms.api.entities.Curso> courses = cursoRepository.findAll();
        List<com.minilms.api.dto.course.CourseDTO> courseDTOs = courses.stream()
            .map(this::convertToDTO)
            .toList();
        return ResponseHandler.success(courseDTOs, "Cursos obtenidos exitosamente", HttpStatus.OK);
    }

    @PatchMapping("/courses/{id}/change-status")
    public ResponseEntity<ApiResponse<com.minilms.api.dto.course.CourseDTO>> changeCourseStatus(
            @PathVariable Long id,
            @RequestParam String newStatus) {
        com.minilms.api.entities.Curso curso = cursoRepository.findById(id)
            .orElseThrow(() -> new com.minilms.api.config.responseApi.ApiException("Curso no encontrado", HttpStatus.NOT_FOUND));

        Estado estado = estadoRepository.findByCodigo(newStatus)
            .orElseThrow(() -> new com.minilms.api.config.responseApi.ApiException("Estado no encontrado: " + newStatus, HttpStatus.BAD_REQUEST));

        curso.setEstado(estado);
        com.minilms.api.entities.Curso updatedCurso = cursoRepository.save(curso);

        return ResponseHandler.success(convertToDTO(updatedCurso), "Estado del curso actualizado exitosamente", HttpStatus.OK);
    }

    private com.minilms.api.dto.course.CourseDTO convertToDTO(com.minilms.api.entities.Curso curso) {
        com.minilms.api.dto.course.CourseDTO dto = new com.minilms.api.dto.course.CourseDTO();
        dto.setId(curso.getId());
        dto.setTitulo(curso.getTitulo());
        dto.setDescripcion(curso.getDescripcion());
        dto.setPrecio(curso.getPrecio());
        dto.setEstadoCodigo(curso.getEstado().getCodigo());
        dto.setEstadoNombre(curso.getEstado().getDescripcion());
        dto.setCategoriaId(curso.getCategoria().getId());
        dto.setCategoriaNombre(curso.getCategoria().getNombre());
        dto.setCreadoEn(curso.getCreadoEn() != null ? curso.getCreadoEn().toString() : null);
        dto.setActualizadoEn(curso.getActualizadoEn() != null ? curso.getActualizadoEn().toString() : null);

        // Set instructor info
        if (curso.getInstructor() != null) {
            com.minilms.api.dto.user.InstructorDTO instructorDTO = new com.minilms.api.dto.user.InstructorDTO();
            instructorDTO.setId(curso.getInstructor().getId());
            instructorDTO.setNombre(curso.getInstructor().getNombre());
            instructorDTO.setApellido(curso.getInstructor().getApellido());
            instructorDTO.setCorreo(curso.getInstructor().getCorreo());
            dto.setInstructor(instructorDTO);
        }

        return dto;
    }
}
