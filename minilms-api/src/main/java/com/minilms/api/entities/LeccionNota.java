package com.minilms.api.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "lecciones_notas", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"usuario_id", "leccion_id"})
})
public class LeccionNota {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "leccion_nota_id")
    private Long id;

    @NotBlank
    @Size(max = 2000) // Un poco más de espacio para las notas
    @Column(name = "contenido_nota", nullable = false, length = 2000)
    private String contenidoNota;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "usuario_id", referencedColumnName = "usuario_id" , nullable = false)
    private User usuario;
    
    @NotNull
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "leccion_id", nullable = false)
    private Leccion leccion;
    
    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;

    @UpdateTimestamp
    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;
}
