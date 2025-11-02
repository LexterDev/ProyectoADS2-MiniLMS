package com.minilms.api.controllers;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minilms.api.config.responseApi.ApiResponse;
import com.minilms.api.config.responseApi.ResponseHandler;
import com.minilms.api.dto.course.CourseDTO;
import com.minilms.api.services.CourseService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/instructor")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class InstructorController {

    private final CourseService service;

    @GetMapping("/dashboard")
    public ResponseEntity<ApiResponse<List<CourseDTO>>> findCoursesByInstructor() {
        return ResponseHandler.generateResponse(service.findCoursesDashboardByInstructor());
    }

}
