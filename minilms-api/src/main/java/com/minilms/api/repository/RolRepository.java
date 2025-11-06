package com.minilms.api.repository;

import com.minilms.api.entities.Rol;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RolRepository extends JpaRepository<Rol, String> {

    /**
     * Busca un rol por su código (ej. "ESTUDIANTE", "ADMINISTRADOR").
     * Spring Data JPA crea automáticamente la consulta a partir del nombre del método.
     * @param codigo El código del rol a buscar.
     * @return Un Optional que contiene el Rol si se encuentra.
     */
    Optional<Rol> findByCodigo(String codigo);
}

