package com.minilms.api.services;

import java.util.List;
import java.util.Optional;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.minilms.api.config.responseApi.PageResponse;
import com.minilms.api.dto.CourseDTO;
import com.minilms.api.mappers.CourseMapper;
import com.minilms.api.repository.CursoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CourseService {

    private final CursoRepository repository;

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

}
