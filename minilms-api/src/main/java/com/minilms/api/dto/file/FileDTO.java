package com.minilms.api.dto.file;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class FileDTO {
    private Long id;
    private LocalDateTime fechaCreacion;
    private String url;
    private String publicId;
    private String formato;
    private String tipoArchivo; 
    private Long tamano;
    private String nombreOriginal;

    private String base64;
}