package com.minilms.api.services;

import com.minilms.api.config.responseApi.ApiException;
import com.minilms.api.dto.admin.AdminStatsDTO;
import com.minilms.api.dto.admin.CreateUserRequest;
import com.minilms.api.entities.Estado;
import com.minilms.api.entities.Rol;
import com.minilms.api.entities.User;
import com.minilms.api.enums.UserRole;
import com.minilms.api.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final CursoRepository cursoRepository;
    private final CategoriaRepository categoriaRepository;
    private final InscripcionRepository inscripcionRepository;
    private final RolRepository rolRepository;
    private final EstadoRepository estadoRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional(readOnly = true)
    public AdminStatsDTO getAdminStats() {
        AdminStatsDTO stats = new AdminStatsDTO();

        // Total users
        stats.setTotalUsers(userRepository.count());

        // Total courses
        stats.setTotalCourses(cursoRepository.count());

        // Total categories
        stats.setTotalCategories(categoriaRepository.count());

        // Active enrollments
        stats.setActiveEnrollments(inscripcionRepository.count());

        // Count instructors
        Rol instructorRole = rolRepository.findByCodigo(UserRole.Instructor.getCodigo())
                .orElse(null);
        stats.setTotalInstructors(instructorRole != null ? userRepository.countByRol(instructorRole) : 0);

        // Count students
        Rol studentRole = rolRepository.findByCodigo(UserRole.Estudiante.getCodigo())
                .orElse(null);
        stats.setTotalStudents(studentRole != null ? userRepository.countByRol(studentRole) : 0);

        return stats;
    }

    @Transactional
    public User createUser(CreateUserRequest request) {
        if (userRepository.existsByCorreo(request.getCorreo())) {
            throw new ApiException("El correo " + request.getCorreo() + " ya está en uso", HttpStatus.BAD_REQUEST);
        }

        // Find role by codigo
        Rol userRole = rolRepository.findByCodigo(request.getRol())
                .orElseThrow(() -> new ApiException("Rol no encontrado: " + request.getRol(), HttpStatus.BAD_REQUEST));

        // Get active state
        Estado activeState = estadoRepository.findByCodigo("ACT")
                .orElseThrow(() -> new ApiException("Estado 'ACT' no encontrado en el catálogo", HttpStatus.BAD_REQUEST));

        User user = new User();
        user.setNombre(request.getNombre());
        user.setApellido(request.getApellido());
        user.setCorreo(request.getCorreo());
        user.setClave(passwordEncoder.encode(request.getClave()));
        user.setRol(userRole);
        user.setEstado(activeState);

        return userRepository.save(user);
    }

    @Transactional
    public User toggleUserStatus(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ApiException("Usuario no encontrado", HttpStatus.NOT_FOUND));

        // Toggle between "ACT" and "INA" estados
        String newStatusCode = user.getEstado().getCodigo().equals("ACT") ? "INA" : "ACT";
        Estado newEstado = estadoRepository.findByCodigo(newStatusCode)
                .orElseThrow(() -> new ApiException("Estado no encontrado: " + newStatusCode, HttpStatus.BAD_REQUEST));

        user.setEstado(newEstado);
        return userRepository.save(user);
    }
}
