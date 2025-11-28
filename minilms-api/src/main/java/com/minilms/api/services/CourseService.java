package com.minilms.api.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicReference;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;

import com.minilms.api.config.responseApi.ApiException;
import com.minilms.api.config.responseApi.PageResponse;
import com.minilms.api.dto.course.CourseCreationBatchDTO;
import com.minilms.api.dto.course.CourseDTO;
import com.minilms.api.dto.course.LessonDTO;
import com.minilms.api.dto.course.SectionDTO;
import com.minilms.api.entities.Adjunto;
import com.minilms.api.entities.Categoria;
import com.minilms.api.entities.Curso;
import com.minilms.api.entities.Estado;
import com.minilms.api.entities.Leccion;
import com.minilms.api.entities.Seccion;
import com.minilms.api.enums.LeccionTipoEnum;
import com.minilms.api.enums.EstadoEnum;
import com.minilms.api.mappers.CourseMapper;
import com.minilms.api.mappers.FileMapper;
import com.minilms.api.repository.CategoriaRepository;
import com.minilms.api.repository.CursoRepository;
import com.minilms.api.repository.EstadoRepository;
import com.minilms.api.repository.LeccionRepository;
import com.minilms.api.repository.SeccionRepository;
import com.minilms.api.utils.LmsUtils;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseService extends LmsUtils {


    private final CursoRepository repository;
    private final SeccionRepository sectionRepository;
    private final LeccionRepository lecturaRepository;
    private final EstadoRepository estadoRepository;
    private final CategoriaRepository categoriaRepository;
    private final FileService fileService;

    public PageResponse<CourseDTO> findCourses(Optional<String> txt, int page, int size) {

        Pageable pageable = PageRequest.of(page, size);
        if (txt.isPresent()) {
            return PageResponse.ofPage(repository.findCoursesBySearch(txt.get(), pageable).map(CourseMapper::toDTO));
        } else {
            return PageResponse.ofPage(repository.findAll(pageable).map(CourseMapper::toDTO));
        }
    }

    public List<CourseDTO> findCoursesByCategory(Long categoryId) {
        return repository.findByCategoriaId(categoryId).stream().map(CourseMapper::toDTO).toList();
    }

    public List<CourseDTO> findCoursesByInstructor(Long instructorId) {
        return repository.findByInstructorId(instructorId).stream().map(CourseMapper::toDTO).toList();
    }

    public CourseDTO getDetails(Long id) {
        Curso cursoCompleto = repository.findDetailsById(id)
                .orElseThrow(() -> new ApiException("No se encontro un Curso con ID: " + id, HttpStatus.NOT_FOUND));

        return CourseMapper.toDetailsDTO(cursoCompleto);
    }

    public CourseDTO createCourse(CourseDTO dto) {
        return CourseMapper.toEntity(dto).map(curso -> {

            curso.setInstructor(getUserLoggedIn());
            Optional<Estado> estado = estadoRepository.findByCodigo(EstadoEnum.BORRADOR.getCodigo());
            Optional<Categoria> categoria = categoriaRepository.findById(dto.getCategoriaId());

            if (estado.isEmpty()) {
                throw new ApiException("No se encontro un estado con el codigo: " + EstadoEnum.BORRADOR.getCodigo(),
                        HttpStatus.BAD_REQUEST);
            }
            if (categoria.isEmpty()) {
                throw new ApiException("No se encontro una categoria con el id: " + dto.getCategoriaId(),
                        HttpStatus.BAD_REQUEST);
            }
            curso.setEstado(estado.get());
            curso.setCategoria(categoria.get());

            FileMapper.toMultipartFile(dto.getAdjunto()).ifPresent(file->{
                fileService.uploadFile(file).ifPresent(adj->{
                    curso.setAdjunto(adj);
                });
            });

            return CourseMapper.toDTO(repository.save(curso));
        }).orElseThrow(
                () -> new ApiException("Ocurrio un error al convertir el objeto de entrada a entidad",
                        HttpStatus.BAD_REQUEST));
    }

    public SectionDTO createCourseSection(SectionDTO dto) {

        boolean duplicateOrder = sectionRepository.findByCursoIdOrderByOrdenAsc(dto.getCursoId()).stream().filter(s -> {
            return s.getCurso().getId() == dto.getCursoId() && s.getOrden() == dto.getOrden();
        }).findFirst().isPresent();

        if (duplicateOrder) {
            throw new ApiException("La posicion " + dto.getOrden() + " ya esta asignada", HttpStatus.BAD_REQUEST);
        }

        return CourseMapper.toSection(dto).map(section -> {

            Optional<Curso> curso = repository.findById(dto.getCursoId());
            if (curso.isEmpty()) {
                throw new ApiException("No se encontro un curso con el id: " + dto.getCursoId(),
                        HttpStatus.BAD_REQUEST);
            }
            section.setCurso(curso.get());
            return CourseMapper.toSectionDTO(sectionRepository.save(section));
        }).orElseThrow(
                () -> new ApiException("Ocurrio un error al convertir el dto de entrada a entidad",
                        HttpStatus.BAD_REQUEST));
    }

    public LessonDTO createCourseLesson(LessonDTO dto) {
        Optional<Seccion> section = sectionRepository.findById(dto.getSeccionId());
        if (section.isEmpty()) {
            throw new ApiException("No se encontro una seccion con el id: " + dto.getSeccionId(),
                    HttpStatus.BAD_REQUEST);
        }

        boolean duplicateOrder = lecturaRepository.findBySeccionIdOrderByOrdenAsc(dto.getSeccionId()).stream()
                .filter(l -> {
                    return l.getSeccion().getId() == dto.getSeccionId() && l.getOrden() == dto.getOrden();
                }).findFirst().isPresent();

        if (duplicateOrder) {
            throw new ApiException("La posicion " + dto.getOrden() + " ya esta asignada", HttpStatus.BAD_REQUEST);
        }

        return CourseMapper.toLesson(dto).map(lesson -> {
            lesson.setSeccion(section.get());
            return CourseMapper.toLessonDTO(lecturaRepository.save(lesson));
        }).orElseThrow(
                () -> new ApiException("Ocurrio un error al convertir el dto de entrada a entidad",
                        HttpStatus.BAD_REQUEST));
    }

    public CourseDTO updateCourse(CourseDTO dto) {
        return repository.findById(dto.getId()).map((course) ->{
            course.setTitulo(dto.getTitulo());
            course.setDescripcion(dto.getDescripcion());
            course.setPrecio(dto.getPrecio());
            course.setActualizadoEn(LocalDateTime.now());
            AtomicReference<Adjunto> prev = new AtomicReference<>();

            if(nullSafetyValue(dto.getEstadoCodigo())) {
                estadoRepository.findByCodigo(dto.getEstadoCodigo()).ifPresent(course::setEstado);
            }
            if(nullSafetyValue(dto.getCategoriaId())) {
                categoriaRepository.findById(dto.getCategoriaId()).ifPresent(course::setCategoria);
            }
            
            FileMapper.toMultipartFile(dto.getAdjunto()).ifPresent(file->{
                fileService.uploadFile(file).ifPresent(fileUploaded->{
                    prev.set(course.getAdjunto());
                    course.setAdjunto(fileUploaded);
                });
            });
            
            Curso courseSaved = repository.save(course);
            if (prev.get() != null) {
                fileService.deleteFile(prev.get().getId());
            }
            return CourseMapper.toDTO(repository.save(courseSaved));
        }).orElseThrow(
                () -> new ApiException("No se encontro un curso con el id: " + dto.getId(), HttpStatus.NOT_FOUND));
    }

    public SectionDTO updateCourseSection(SectionDTO dto) {
        return sectionRepository.findById(dto.getId()).map((section) ->{
            section.setTitulo(dto.getTitulo());
            section.setVisible(dto.isVisible());
            section.setActualizadoEn(LocalDateTime.now());
            return CourseMapper.toSectionDTO(sectionRepository.save(section));
        }).orElseThrow(
                () -> new ApiException("No se encontro una seccion con el id: " + dto.getId(), HttpStatus.NOT_FOUND));

    }

    public LessonDTO updateCourseLesson(LessonDTO dto) {
        return lecturaRepository.findById(dto.getId()).map((lesson) ->{
            lesson.setTitulo(dto.getTitulo());
            lesson.setUrl(dto.getUrl());
            lesson.setContenido(dto.getContenido());
            lesson.setTipo(dto.getTipo());
            lesson.setVisible(dto.isVisible());
            lesson.setActualizadoEn(LocalDateTime.now());
            return CourseMapper.toLessonDTO(lecturaRepository.save(lesson));
        }).orElseThrow(
                () -> new ApiException("No se encontro una leccion con el id: " + dto.getId(), HttpStatus.NOT_FOUND));
    }

    public String deleteCourse(Long id) {
        return repository.findById(id).map((course) ->{
            course.setEliminado(Short.valueOf("1"));
            course.setActualizadoEn(LocalDateTime.now());
            Curso entity = repository.save(course);
            return String.format("Curso %s eliminado con exito",  entity.getTitulo());
        }).orElseThrow(
                () -> new ApiException("No se encontro un curso con el id: " + id, HttpStatus.NOT_FOUND));
    }

    public List<CourseDTO> findCoursesDashboardByInstructor() {
        return repository.findByInstructorId(getLoggedInUserId()).stream().map(CourseMapper::toDTOToInstructor).toList();
    }

    /**
     * Crea un curso completo con sus secciones y lecciones en una sola transacción
     */
    public CourseDTO createCourseBatch(CourseCreationBatchDTO batchDTO) {
        // 1. Validar y obtener dependencias
        Estado estado = estadoRepository.findByCodigo(EstadoEnum.BORRADOR.getCodigo())
                .orElseThrow(() -> new ApiException(
                        "No se encontró el estado BORRADOR",
                        HttpStatus.INTERNAL_SERVER_ERROR));

        Categoria categoria = categoriaRepository.findById(batchDTO.getCategoriaId())
                .orElseThrow(() -> new ApiException(
                        "No se encontró una categoría con el id: " + batchDTO.getCategoriaId(),
                        HttpStatus.BAD_REQUEST));

        // 2. Crear el curso
        Curso curso = new Curso();
        curso.setTitulo(batchDTO.getTitulo());
        curso.setDescripcion(batchDTO.getDescripcion());
        curso.setPrecio(batchDTO.getPrecio());
        curso.setEstado(estado);
        curso.setCategoria(categoria);
        curso.setInstructor(getUserLoggedIn());
        curso.setEliminado(Short.valueOf("0"));

        // 3. Guardar curso para obtener ID
        curso = repository.save(curso);

        // 4. Procesar imagen si existe
        if (batchDTO.getAdjunto() != null && batchDTO.getAdjunto().getBase64() != null) {
            final Curso cursoFinal = curso;
            FileMapper.toMultipartFile(batchDTO.getAdjunto()).ifPresent(multipartFile -> {
                fileService.uploadFile(multipartFile).ifPresent(adjunto -> {
                    cursoFinal.setAdjunto(adjunto);
                    repository.save(cursoFinal);
                });
            });
        }

        // 5. Crear secciones y lecciones si existen
        if (batchDTO.getSecciones() != null && !batchDTO.getSecciones().isEmpty()) {
            for (CourseCreationBatchDTO.SectionCreationDTO sectionDTO : batchDTO.getSecciones()) {
                // Validar orden único de sección
                if (sectionRepository.findByCursoIdAndOrden(curso.getId(), sectionDTO.getOrden()).isPresent()) {
                    throw new ApiException(
                            "Ya existe una sección con el orden " + sectionDTO.getOrden() + " en este curso",
                            HttpStatus.BAD_REQUEST);
                }

                // Crear sección
                Seccion seccion = new Seccion();
                seccion.setTitulo(sectionDTO.getTitulo());
                seccion.setOrden(sectionDTO.getOrden());
                seccion.setDuracionEstimada(sectionDTO.getDuracionEstimada());
                seccion.setVisible(true);
                seccion.setCurso(curso);
                seccion = sectionRepository.save(seccion);

                // Crear lecciones si existen
                if (sectionDTO.getLecciones() != null && !sectionDTO.getLecciones().isEmpty()) {
                    final Seccion seccionFinal = seccion;

                    for (CourseCreationBatchDTO.LessonCreationDTO lessonDTO : sectionDTO.getLecciones()) {
                        // Validar orden único de lección
                        if (lecturaRepository.findBySeccionIdAndOrden(seccionFinal.getId(), lessonDTO.getOrden()).isPresent()) {
                            throw new ApiException(
                                    "Ya existe una lección con el orden " + lessonDTO.getOrden() + " en esta sección",
                                    HttpStatus.BAD_REQUEST);
                        }

                        // Crear lección
                        Leccion leccion = new Leccion();
                        leccion.setTitulo(lessonDTO.getTitulo());
                        leccion.setUrl(lessonDTO.getUrl());
                        leccion.setContenido(lessonDTO.getContenido());
                        leccion.setOrden(lessonDTO.getOrden());
                        leccion.setVisible(true);
                        leccion.setSeccion(seccionFinal);

                        // Asignar tipo de lección
                        if (lessonDTO.getTipo() != null && !lessonDTO.getTipo().isEmpty()) {
                            try {
                                leccion.setTipo(LeccionTipoEnum.valueOf(lessonDTO.getTipo().toUpperCase()));
                            } catch (IllegalArgumentException e) {
                                leccion.setTipo(LeccionTipoEnum.VIDEO);
                            }
                        } else {
                            leccion.setTipo(LeccionTipoEnum.VIDEO);
                        }

                        lecturaRepository.save(leccion);
                    }
                }
            }
        }

        // 6. Recargar el curso con todas sus relaciones
        Curso cursoCompleto = repository.findDetailsById(curso.getId())
                .orElse(curso);

        return CourseMapper.toDetailsDTO(cursoCompleto);
    }
}
