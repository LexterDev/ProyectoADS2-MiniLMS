package com.minilms.api.entities;

import jakarta.persistence.*;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDateTime;
import java.util.Collection;
import java.util.Collections;

@Entity
@Table(name = "usuarios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User implements UserDetails {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "usuario_id")
    private Long usuarioId; // CORREGIDO: Renombrado de 'id' a 'usuarioId' para consistencia.
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 50)
    @Column(nullable = false, length = 50)
    private String nombre;
    
    @NotBlank(message = "El apellido es obligatorio")
    @Size(min = 2, max = 50)
    @Column(nullable = false, length = 50)
    private String apellido;
    
    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El formato del correo no es válido")
    @Column(nullable = false, unique = true, length = 100)
    private String correo;
    
    @NotBlank(message = "La clave es obligatoria")
    @Column(nullable = false)
    private String clave;
    
    @ManyToOne
    @JoinColumn(name = "rol_id", nullable = false)
    private Rol rol;
    
    @ManyToOne
    @JoinColumn(name = "estado_id", nullable = false)
    private Estado estado;
    
    @CreationTimestamp
    @Column(name = "creado_en", nullable = false, updatable = false)
    private LocalDateTime creadoEn;
    
    @UpdateTimestamp
    @Column(name = "actualizado_en")
    private LocalDateTime actualizadoEn;

    // Métodos de UserDetails (adaptados)
    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // CORREGIDO: Se usa getCodigo() en lugar de getId() porque la llave primaria de Rol es 'codigo'.
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + rol.getCodigo()));
    }
    
    @Override
    public String getUsername() {
        return correo;
    }
    
    @Override
    public String getPassword() {
        return clave;
    }
    
    @Override
    public boolean isAccountNonExpired() {
        return true;
    }
    
    @Override
    public boolean isAccountNonLocked() {
        // CORREGIDO: Se usa getCodigo() en lugar de getId() porque la llave primaria de Estado es 'codigo'.
        return this.estado != null && this.estado.getCodigo().equals("ACT");
    }
    
    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }
    
    @Override
    public boolean isEnabled() {
        // CORREGIDO: Se usa getCodigo() en lugar de getId() porque la llave primaria de Estado es 'codigo'.
        return this.estado != null && this.estado.getCodigo().equals("ACT");
    }
}

