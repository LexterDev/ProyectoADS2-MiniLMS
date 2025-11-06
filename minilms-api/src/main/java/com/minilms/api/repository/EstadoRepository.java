package com.minilms.api.repository;

import com.minilms.api.entities.Estado;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EstadoRepository extends JpaRepository<Estado, String> {

    /**
     * Busca un estado por su código (ej. "ACT", "INA", "PEND").
     * Spring Data JPA crea automáticamente la consulta a partir del nombre del método.
     * @param codigo El código del estado a buscar.
     * @return Un Optional que contiene el Estado si se encuentra.
     */
    Optional<Estado> findByCodigo(String codigo);
}

