package com.minilms.api.dto.file;

import lombok.Data;

@Data
public class CloudinaryUploadResult {
    private String secureUrl;
    private String publicId;
    private String formato;
    private String tipoArchivo; 
    private Long tamano;
    private String nombreOriginal;
}
