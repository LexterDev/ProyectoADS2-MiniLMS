package com.minilms.api.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.minilms.api.config.responseApi.ApiException;
import com.minilms.api.dto.course.CourseDTO;
import com.minilms.api.dto.inscription.InscriptionDTO;
import com.minilms.api.dto.inscription.InscriptionProgressDTO;
import com.minilms.api.dto.inscription.UpdateTimeSpentDTO;
import com.minilms.api.entities.Curso;
import com.minilms.api.entities.Estado;
import com.minilms.api.entities.Inscripcion;
import com.minilms.api.entities.InscripcionProgreso;
import com.minilms.api.entities.Leccion;
import com.minilms.api.enums.EstadoEnum;
import com.minilms.api.mappers.InscriptionMapper;
import com.minilms.api.repository.CursoRepository;
import com.minilms.api.repository.EstadoRepository;
import com.minilms.api.repository.InscripcionProgresoRepository;
import com.minilms.api.repository.InscripcionRepository;
import com.minilms.api.repository.LeccionRepository;
import com.minilms.api.utils.LmsUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class EnrollService extends LmsUtils {

    private final InscripcionRepository repository;
    private final EstadoRepository estadoRepository;
    private final CursoRepository cursoRepository;
    private final LeccionRepository lessonRepository;
    private final InscripcionProgresoRepository progresoRepository;

    public InscriptionDTO inscriptionCourse(InscriptionDTO dto) {
        return InscriptionMapper.toEntity(dto).map(
                (entity) -> {

                    entity.setEstudiante(getUserLoggedIn());
                    Optional<Estado> estado = estadoRepository.findByCodigo(EstadoEnum.INSCRITO.getCodigo());
                    Optional<Curso> curso = cursoRepository.findById(dto.getCursoId());
                    if (estado.isEmpty()) {
                        throw new ApiException(
                                "No se encontro un estado con el codigo: " + EstadoEnum.INSCRITO.getCodigo(),
                                HttpStatus.BAD_REQUEST);
                    }
                    if (curso.isEmpty()) {
                        throw new ApiException("No se encontro un curso con el id: " + dto.getCursoId(),
                                HttpStatus.BAD_REQUEST);
                    }
                    entity.setEstado(estado.get());
                    entity.setCurso(curso.get());

                    return InscriptionMapper.toDTO(repository.save(entity));
                }).orElseThrow(
                        () -> new RuntimeException("Ocurrio un error al convertir el objeto de entrada a entidad"));
    }

    public InscriptionProgressDTO markLesson(InscriptionProgressDTO dto) {
        return repository.findByEstudianteIdAndCursoId(getLoggedInUserId(), dto.getCursoId()).map(ins -> {
            Leccion lesson = lessonRepository.findById(dto.getLeccionId()).orElseThrow(
                    () -> new ApiException("No se encontro una leccion con el id: " + dto.getLeccionId(),
                            HttpStatus.NOT_FOUND));

            InscripcionProgreso progress = progresoRepository
                    .findByInscripcionIdAndLeccionId(ins.getId(), lesson.getId()).map(
                            p -> {
                                p.setCompletado(dto.isCompletado());
                                p.setFechaCompletado(LocalDateTime.now());
                                p.setNotaEvaluacion(dto.getNotaEvaluacion());
                                return p;
                            })
                    .orElseGet(() -> {
                        InscripcionProgreso p = InscriptionMapper.toEntity(dto);
                        p.setInscripcion(ins);
                        p.setLeccion(lesson);
                        return p;
                    });

            InscripcionProgreso aux = progresoRepository.save(progress);
            Inscripcion auxIns = updateInscriptionProgress(ins);
            if(auxIns != null){
                aux.setInscripcion(auxIns);
            }
            return InscriptionMapper.toDTO(aux);
        }).orElseThrow(
                () -> new ApiException("No se encontro una inscripcion con el id: " + dto.getId(),
                        HttpStatus.NOT_FOUND));
    }

    public Inscripcion updateInscriptionProgress(Inscripcion inscripcion) {

        Long cursoId = inscripcion.getCurso().getId();
        long lessonTotal = lessonRepository.countByCursoId(cursoId);

        if (lessonTotal == 0) {
            inscripcion.setProgreso(0);
            inscripcion.setCompletado(false);
            inscripcion.setFechaFinCurso(null);
            repository.save(inscripcion);
            return null;
        }

        long completedLesson = progresoRepository.countByInscripcionIdAndCompletadoTrue(inscripcion.getId());

        double porcentaje = ((double) completedLesson / lessonTotal) * 100.0;
        int progresoRedondeado = (int) Math.round(porcentaje);

        inscripcion.setProgreso(progresoRedondeado);

        if (progresoRedondeado >= 100) {
            inscripcion.setCompletado(true);
            inscripcion.setFechaFinCurso(LocalDateTime.now());
        } else {
            inscripcion.setCompletado(false);
            inscripcion.setFechaFinCurso(null);
        }

        return repository.save(inscripcion);
    }

    public List<CourseDTO> findCourses() {
        return repository.findByEstudiante(getUserLoggedIn()).stream().map(InscriptionMapper::toCourseDTO).toList();
    }

    public InscriptionProgressDTO updateTimeSpent(Long cursoId, UpdateTimeSpentDTO dto) {
        return repository.findByEstudianteIdAndCursoId(getLoggedInUserId(), cursoId).map(ins -> {
            Leccion lesson = lessonRepository.findById(dto.getLeccionId()).orElseThrow(
                    () -> new ApiException("No se encontró una lección con el id: " + dto.getLeccionId(),
                            HttpStatus.NOT_FOUND));

            InscripcionProgreso progress = progresoRepository
                    .findByInscripcionIdAndLeccionId(ins.getId(), lesson.getId())
                    .map(p -> {
                        // Actualizar el tiempo dedicado acumulado
                        Long tiempoActual = p.getTiempoDedicado() != null ? p.getTiempoDedicado() : 0L;
                        p.setTiempoDedicado(tiempoActual + dto.getTiempoDedicadoSegundos());
                        p.setUltimaActualizacion(LocalDateTime.now());
                        return p;
                    })
                    .orElseGet(() -> {
                        // Crear nuevo registro de progreso si no existe
                        InscripcionProgreso p = new InscripcionProgreso();
                        p.setInscripcion(ins);
                        p.setLeccion(lesson);
                        p.setTiempoDedicado(dto.getTiempoDedicadoSegundos());
                        p.setUltimaActualizacion(LocalDateTime.now());
                        p.setCompletado(false);
                        return p;
                    });

            InscripcionProgreso saved = progresoRepository.save(progress);
            return InscriptionMapper.toDTO(saved);
        }).orElseThrow(
                () -> new ApiException("No se encontró una inscripción para el curso con id: " + cursoId,
                        HttpStatus.NOT_FOUND));
    }

    public Long getTotalTimeSpentInCourse(Long cursoId) {
        return repository.findByEstudianteIdAndCursoId(getLoggedInUserId(), cursoId)
                .map(ins -> progresoRepository.sumTiempoDedicadoByInscripcionId(ins.getId())
                        .orElse(0L))
                .orElse(0L);
    }
}
