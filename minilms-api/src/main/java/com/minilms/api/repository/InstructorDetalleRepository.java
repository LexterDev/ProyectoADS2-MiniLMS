package com.minilms.api.repository;

import com.minilms.api.entities.InstructorDetalle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface InstructorDetalleRepository extends JpaRepository<InstructorDetalle, Long> {
}
