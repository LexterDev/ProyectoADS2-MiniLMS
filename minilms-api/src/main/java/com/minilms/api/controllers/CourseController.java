package com.minilms.api.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.CrossOrigin;
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
import com.minilms.api.dto.course.CourseDTO;
import com.minilms.api.dto.course.LessonDTO;
import com.minilms.api.dto.course.SectionDTO;
import com.minilms.api.services.CourseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;

    @GetMapping("/findAll")
    public ResponseEntity<ApiResponse<PageResponse<CourseDTO>>> findCourses(
            @RequestParam(required = false) String txt,
            @RequestParam(required = false, defaultValue = "0") int page,
            @RequestParam(required = false, defaultValue = "10") int size) {
        return ResponseHandler.generateResponse(courseService.findCourses(Optional.ofNullable(txt), page, size));
    }

    @GetMapping("/findByCategory")
    public ResponseEntity<ApiResponse<List<CourseDTO>>> findCoursesByCategory(
            @RequestParam Long categoryId) {
        return ResponseHandler.generateResponse(courseService.findCoursesByCategory(categoryId));
    }

    @GetMapping("/findByInstructor")
    public ResponseEntity<ApiResponse<List<CourseDTO>>> findCoursesByInstructor(
            @RequestParam Long instructorId) {
        return ResponseHandler.generateResponse(courseService.findCoursesByInstructor(instructorId));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<CourseDTO>> getDetails(
            @PathVariable Long id) {
        return ResponseHandler.generateResponse(courseService.getDetails(id));
    }

    @PostMapping("/create")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<CourseDTO>> createCourse(@RequestBody CourseDTO dto) {
        return ResponseHandler.generateResponse(courseService.createCourse(dto));
    }

    @PostMapping("/createSection")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<SectionDTO>> createCourseSection(@RequestBody SectionDTO dto) {
        return ResponseHandler.generateResponse(courseService.createCourseSection(dto));
    }

    @PostMapping("/createLesson")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<LessonDTO>> createCourseLesson(@RequestBody LessonDTO dto) {
        return ResponseHandler.generateResponse(courseService.createCourseLesson(dto));
    }

    @PutMapping("/update")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<CourseDTO>> updateCourse(@RequestBody CourseDTO dto) {
        return ResponseHandler.generateResponse(courseService.updateCourse(dto));
    }

    @PutMapping("/updateSection")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<SectionDTO>> updateCourseSection(@RequestBody SectionDTO dto) {
        return ResponseHandler.generateResponse(courseService.updateCourseSection(dto));
    }

    @PutMapping("/updateLesson")
    @PreAuthorize("hasRole('INSTRUCTOR')")
    public ResponseEntity<ApiResponse<LessonDTO>> updateCourseLesson(@RequestBody LessonDTO dto) {
        return ResponseHandler.generateResponse(courseService.updateCourseLesson(dto));
    }

}
