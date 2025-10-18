package com.minilms.api.entities;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Entity
@Table(name = "formas_pago")
public class FormaPago {

    @Id
    @Column(name = "forma_pago_id", length = 20)
    private String id; // Ejemplo: 'TARJETA', 'PAYPAL'

    @NotBlank
    @Column(nullable = false, length = 100)
    private String nombre;
}
