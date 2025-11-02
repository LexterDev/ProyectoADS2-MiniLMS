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
import com.minilms.api.services.EnrollService;

import lombok.RequiredArgsConstructor;


@RestController
@RequestMapping("/api/student")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class StudentController {

    private final EnrollService service;

    @GetMapping("/dashboard")
     public ResponseEntity<ApiResponse<List<CourseDTO>>> findCourses() {
        return ResponseHandler.generateResponse(service.findCourses());
    }
    

}
