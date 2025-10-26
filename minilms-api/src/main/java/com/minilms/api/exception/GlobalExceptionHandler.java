package com.minilms.api.exception;

import java.util.HashMap;
import java.util.Map;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.dao.InvalidDataAccessApiUsageException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.servlet.NoHandlerFoundException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import com.minilms.api.config.responseApi.ApiException;
import com.minilms.api.config.responseApi.ApiResponse;
import com.minilms.api.config.responseApi.ResponseHandler;
import com.minilms.api.dto.MessageResponse;

import lombok.extern.slf4j.Slf4j;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<MessageResponse> handleBadCredentials(BadCredentialsException ex) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("Credenciales inválidas"));
    }

    /* Captura excepciones personalizadas con su propio código de estado */
    @ExceptionHandler(ApiException.class)
    public ResponseEntity<ApiResponse<Object>> handleCustomException(ApiException ex) {
        return ResponseHandler.generateErrorResponse(ex.getMessage(), ex.getStatus());
    }

    /* Capturas endpoint que no existe */
    @ExceptionHandler(NoHandlerFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNotFoundException(NoHandlerFoundException ex) {
        return ResponseHandler.generateErrorResponse("Endpoint no encontrado", HttpStatus.NOT_FOUND);
    }

    /* Captura las clases con validaciones */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Map<String, String>>> handleValidationExceptions(
            MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors()
                .forEach(error -> errors.put(error.getField(), error.getDefaultMessage()));
        return ResponseHandler.generateErrorResponse("Informacion incompleta", HttpStatus.BAD_REQUEST, errors);
    }

    @ExceptionHandler(InvalidDataAccessApiUsageException.class)
    public ResponseEntity<ApiResponse<Object>> handleTransientPropertyValueException(
            InvalidDataAccessApiUsageException ex) {
        return ResponseHandler.generateErrorResponse(
                "Invalid use of API de JPA/Hibernate. Cause By: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ApiResponse<Object>> handleNoResourceFoundException(NoResourceFoundException ex) {
        return ResponseHandler.generateErrorResponse("Not Found. Cause By: " + ex.getMessage(), HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ApiResponse<Object>> handleHttpRequestMethodNotSupportedException(
            HttpRequestMethodNotSupportedException ex) {
        return ResponseHandler.generateErrorResponse("Request method is not supported. Cause By: " + ex.getMessage(),
                HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ApiResponse<Object>> handleDataIntegrityViolationException(
            DataIntegrityViolationException ex) {
        return ResponseHandler.generateErrorResponse("Data Integrity Violation. Cause By: " + ex.getMessage(),
                HttpStatus.BAD_REQUEST);
    }

    /* Captura cualquier otra excepción y devuelve 500 */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Object>> handleGenericException(Exception ex) {
        log.error("Error al procesar la petición", ex);
        return ResponseHandler.generateErrorResponse("Internal Server Error. Cause By: " + ex.getMessage(),
                HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
