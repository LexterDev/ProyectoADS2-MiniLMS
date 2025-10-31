package com.minilms.api.utils;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import com.minilms.api.config.responseApi.ApiException;
import com.minilms.api.entities.User;

public class LmsUtils {

    public static final DateTimeFormatter DD_MM_YYYY = DateTimeFormatter.ofPattern("dd/MM/yyyy");
    public static final DateTimeFormatter DD_MM_YYYY_HH_MM_SS = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

    public static String formatDate(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DD_MM_YYYY);
    }

    public static String formatDateTime(LocalDateTime dateTime) {
        if (dateTime == null) {
            return null;
        }
        return dateTime.format(DD_MM_YYYY_HH_MM_SS);
    }

    public static User getUserLoggedIn() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

        if (authentication == null || !authentication.isAuthenticated()) {
            throw new ApiException("No hay un usuario autenticado en el contexto de seguridad.",
                    HttpStatus.UNAUTHORIZED);
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof User) {
            return (User) principal;
        }

        throw new ApiException("Principal Context no es una instancia de la entidad User.", HttpStatus.UNAUTHORIZED);
    }

    public static Long getLoggedInUserId() {
        return getUserLoggedIn().getId();
    }

    public static boolean nullSafetyValue(Object object) {
        if (object == null) {
            return false;
        }
        switch (object.getClass().getSimpleName()) {
            case "String":
                return !((String) object).isEmpty();
            case "Integer":
                return ((Integer) object) != 0;
            case "Long":
                return ((Long) object) != 0;
            case "Double":
                return ((Double) object) != 0;
            case "Float":
                return ((Float) object) != 0;
            case "BigDecimal":
                return ((BigDecimal) object).compareTo(BigDecimal.ZERO) != 0;
            default:
                return true;
        }
    }
}
