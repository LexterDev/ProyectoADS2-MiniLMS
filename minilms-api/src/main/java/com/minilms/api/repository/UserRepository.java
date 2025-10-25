package com.minilms.api.repository;

import com.minilms.api.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Busca un usuario por su dirección de correo electrónico.
     * Corregido para usar el campo 'correo'.
     */
    Optional<User> findByCorreo(String correo);

    /**
     * Verifica si ya existe un usuario con una dirección de correo electrónico.
     * Corregido para usar el campo 'correo'.
     */
    boolean existsByCorreo(String correo);
}
