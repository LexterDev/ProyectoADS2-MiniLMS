package com.minilms.api.config.responseApi;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

public class ResponseHandler {

    public static <T> ResponseEntity<ApiResponse<T>> generateResponse(T data) {
        return new ResponseEntity<>(new ApiResponse<>(
                HttpStatus.OK.value(), "Operación realizada con éxito", data), HttpStatus.OK);
    }

    public static <T> ResponseEntity<ApiResponse<T>> generateResponse(String message) {
        return new ResponseEntity<>(new ApiResponse<>(
                HttpStatus.OK.value(), message), HttpStatus.OK);
    }

    public static <T> ResponseEntity<ApiResponse<T>> generateResponse(T data, HttpStatus status) {
        return new ResponseEntity<>(new ApiResponse<>(
                status.value(), "Operación realizada con éxito", data), status);
    }

    public static <T> ResponseEntity<ApiResponse<T>> success(T data, String message, HttpStatus status) {
        return new ResponseEntity<>(new ApiResponse<>(
                status.value(), message, data), status);
    }

    public static <T> ResponseEntity<ApiResponse<Object>> generateErrorResponse(String message, HttpStatus status) {
        return new ResponseEntity<>(new ApiResponse<>(status.value(), message), status);
    }

    public static <T> ResponseEntity<ApiResponse<Map<String, String>>> generateErrorResponse(String message,
            HttpStatus status, Map<String, String> errors) {
        return new ResponseEntity<>(new ApiResponse<>(status.value(), message, errors), status);
    }

}