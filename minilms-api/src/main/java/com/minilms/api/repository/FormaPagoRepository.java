package com.minilms.api.repository;

import com.minilms.api.entities.FormaPago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FormaPagoRepository extends JpaRepository<FormaPago, String> {
}
