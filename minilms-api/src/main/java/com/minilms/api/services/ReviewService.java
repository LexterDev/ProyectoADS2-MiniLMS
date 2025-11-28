package com.minilms.api.services;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minilms.api.config.responseApi.ApiException;
import com.minilms.api.dto.course.ReviewDTO;
import com.minilms.api.entities.Curso;
import com.minilms.api.entities.Resena;
import com.minilms.api.entities.User;
import com.minilms.api.mappers.ReviewMapper;
import com.minilms.api.repository.CursoRepository;
import com.minilms.api.repository.InscripcionRepository;
import com.minilms.api.repository.ResenaRepository;
import com.minilms.api.utils.LmsUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewService extends LmsUtils {

    private final ResenaRepository resenaRepository;
    private final CursoRepository cursoRepository;
    private final InscripcionRepository inscripcionRepository;

    /**
     * Crea una nueva reseña para un curso.
     * Solo los estudiantes inscritos pueden dejar reseñas.
     */
    @Transactional
    public ReviewDTO createReview(ReviewDTO dto) {
        User user = getUserLoggedIn();
        Long userId = user.getId();

        // Verificar que el curso existe
        Curso curso = cursoRepository.findById(dto.getCursoId())
                .orElseThrow(() -> new ApiException(
                        "No se encontró un curso con el id: " + dto.getCursoId(),
                        HttpStatus.NOT_FOUND));

        // Verificar que el estudiante está inscrito en el curso
        boolean isEnrolled = inscripcionRepository
                .findByEstudianteIdAndCursoId(userId, dto.getCursoId())
                .isPresent();

        if (!isEnrolled) {
            throw new ApiException(
                    "Debes estar inscrito en el curso para dejar una reseña",
                    HttpStatus.FORBIDDEN);
        }

        // Verificar que el usuario no haya dejado una reseña previamente
        if (resenaRepository.existsByUsuarioIdAndCursoId(userId, dto.getCursoId())) {
            throw new ApiException(
                    "Ya has dejado una reseña para este curso",
                    HttpStatus.CONFLICT);
        }

        // Crear la reseña
        Resena resena = ReviewMapper.toEntity(dto);
        resena.setUsuario(user);
        resena.setCurso(curso);

        Resena savedResena = resenaRepository.save(resena);
        return ReviewMapper.toDTO(savedResena);
    }

    /**
     * Actualiza una reseña existente.
     * Solo el autor puede actualizar su propia reseña.
     */
    @Transactional
    public ReviewDTO updateReview(Long reviewId, ReviewDTO dto) {
        User user = getUserLoggedIn();

        Resena resena = resenaRepository.findById(reviewId)
                .orElseThrow(() -> new ApiException(
                        "No se encontró una reseña con el id: " + reviewId,
                        HttpStatus.NOT_FOUND));

        // Verificar que el usuario es el autor de la reseña
        if (!resena.getUsuario().getId().equals(user.getId())) {
            throw new ApiException(
                    "No tienes permiso para actualizar esta reseña",
                    HttpStatus.FORBIDDEN);
        }

        // Actualizar campos
        resena.setCalificacion(dto.getCalificacion());
        resena.setComentario(dto.getComentario());

        Resena updatedResena = resenaRepository.save(resena);
        return ReviewMapper.toDTO(updatedResena);
    }

    /**
     * Elimina una reseña.
     * Solo el autor o un administrador pueden eliminar la reseña.
     */
    @Transactional
    public void deleteReview(Long reviewId) {
        User user = getUserLoggedIn();

        Resena resena = resenaRepository.findById(reviewId)
                .orElseThrow(() -> new ApiException(
                        "No se encontró una reseña con el id: " + reviewId,
                        HttpStatus.NOT_FOUND));

        // Verificar permisos (autor o administrador)
        boolean isAuthor = resena.getUsuario().getId().equals(user.getId());
        boolean isAdmin = user.getRol().getCodigo().equals("ADMINISTRADOR");

        if (!isAuthor && !isAdmin) {
            throw new ApiException(
                    "No tienes permiso para eliminar esta reseña",
                    HttpStatus.FORBIDDEN);
        }

        resenaRepository.delete(resena);
    }

    /**
     * Obtiene todas las reseñas de un curso.
     */
    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsByCourse(Long cursoId) {
        // Verificar que el curso existe
        if (!cursoRepository.existsById(cursoId)) {
            throw new ApiException(
                    "No se encontró un curso con el id: " + cursoId,
                    HttpStatus.NOT_FOUND);
        }

        List<Resena> resenas = resenaRepository.findByCursoId(cursoId);
        return resenas.stream()
                .map(ReviewMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene las reseñas de un usuario.
     */
    @Transactional(readOnly = true)
    public List<ReviewDTO> getReviewsByUser(Long userId) {
        List<Resena> resenas = resenaRepository.findByUsuarioId(userId);
        return resenas.stream()
                .map(ReviewMapper::toDTO)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene el promedio de calificaciones de un curso.
     */
    @Transactional(readOnly = true)
    public Double getAverageRating(Long cursoId) {
        Double average = resenaRepository.findAverageRatingByCursoId(cursoId);
        return average != null ? Math.round(average * 10.0) / 10.0 : 0.0;
    }

    /**
     * Obtiene el número total de reseñas de un curso.
     */
    @Transactional(readOnly = true)
    public Long getReviewCount(Long cursoId) {
        return resenaRepository.countByCursoId(cursoId);
    }

    /**
     * Verifica si un usuario ya ha dejado una reseña para un curso.
     */
    @Transactional(readOnly = true)
    public boolean hasUserReviewedCourse(Long userId, Long cursoId) {
        return resenaRepository.existsByUsuarioIdAndCursoId(userId, cursoId);
    }
}
