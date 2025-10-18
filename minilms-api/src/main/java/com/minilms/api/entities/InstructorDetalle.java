package com.minilms.api.entities;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "instructores_detalles")
public class InstructorDetalle {

    @Id
    @Column(name = "usuario_id") // La PK es también la FK a la tabla usuarios
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @MapsId // Esto le dice a Hibernate que la PK de esta tabla es la misma que la de User
    @JoinColumn(name = "usuario_id")
    private User user;

    @Column(length = 900)
    private String biografia;

    // Puedes agregar más campos específicos del instructor aquí (website, etc.)

    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;
}
