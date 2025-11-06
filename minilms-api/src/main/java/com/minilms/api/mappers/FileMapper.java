package com.minilms.api.mappers;

import java.util.Base64;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.multipart.MultipartFile;

import com.minilms.api.dto.file.Base64MultipartFile;
import com.minilms.api.dto.file.FileDTO;
import com.minilms.api.entities.Adjunto;

public class FileMapper {
    private static final Logger logger = LoggerFactory.getLogger(FileMapper.class);

    public static FileDTO toDTO(Adjunto entity) {
        if (entity == null) {
            return null;
        }

        FileDTO dto = new FileDTO();
        dto.setId(entity.getId());
        dto.setFechaCreacion(entity.getFechaCreacion());
        dto.setUrl(entity.getUrl());
        dto.setPublicId(entity.getPublicId());
        dto.setFormato(entity.getFormato());
        dto.setTipoArchivo(entity.getTipoArchivo());
        dto.setTamano(entity.getTamano());
        dto.setNombreOriginal(entity.getNombreOriginal());

        return dto;
    }

    public static Optional<MultipartFile> toMultipartFile(FileDTO dto) {
    if (dto == null || dto.getBase64() == null) {
        return Optional.empty();
    }
    
    try {
        String base64Data = dto.getBase64();
        if (base64Data.contains(",")) {
            base64Data = base64Data.split(",")[1];
        }

        byte[] decodedBytes = Base64.getDecoder().decode(base64Data);

        return Optional.of(new Base64MultipartFile(
                decodedBytes,
                dto.getNombreOriginal(),
                dto.getTipoArchivo(),
                dto.getTamano() != null ? dto.getTamano() : decodedBytes.length
        ));
        
    } catch (Exception e) {
        logger.error("Error al convertir base64 a MultipartFile", e);
        return Optional.empty();
    }
}

}
