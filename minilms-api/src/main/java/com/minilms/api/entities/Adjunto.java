package com.minilms.api.entities;

import java.time.LocalDateTime;

import org.hibernate.annotations.CreationTimestamp;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
@Entity
@Table(name = "adjunto")
public class Adjunto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "adjunto_id")
    private Long id;
    @CreationTimestamp
    @Column(name = "fecha_creacion", nullable = false, updatable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
    private LocalDateTime fechaCreacion;
    @Column(name = "url", nullable = false, length = 250)
    private String url;
    @Column(name = "public_id", nullable = false, length = 100)
    private String publicId;
    @Column(name = "tipo_archivo", nullable = false, length = 20)
    private String tipoArchivo;
    @Column(name = "formato", nullable = false, length = 50)
    private String formato;
    @Column(name = "tamano", nullable = false)
    private Long tamano;
    @Column(name = "nombre_original", nullable = false, length = 150)
    private String nombreOriginal;
}
