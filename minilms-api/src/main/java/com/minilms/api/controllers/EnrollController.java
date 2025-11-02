package com.minilms.api.controllers;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.minilms.api.config.responseApi.ApiResponse;
import com.minilms.api.config.responseApi.ResponseHandler;
import com.minilms.api.dto.inscription.InscriptionDTO;
import com.minilms.api.dto.inscription.InscriptionProgressDTO;
import com.minilms.api.services.EnrollService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/enroll")
@CrossOrigin(origins = "http://localhost:4200")
@RequiredArgsConstructor
public class EnrollController {

    private final EnrollService enrollService;

    @PostMapping("/")
    public ResponseEntity<ApiResponse<InscriptionDTO>> inscriptionCourse(@RequestBody InscriptionDTO dto) {
        return ResponseHandler.generateResponse(enrollService.inscriptionCourse(dto));
    }

    @PostMapping("/markLesson")
    // @PreAuthorize("hasRole('ESTUDIANTE')")
    public ResponseEntity<ApiResponse<InscriptionProgressDTO>> markLesson(@RequestBody InscriptionProgressDTO dto) {
        return ResponseHandler.generateResponse(enrollService.markLesson(dto));
    }

}
