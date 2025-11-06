package com.minilms.api.services;

import java.io.IOException;
import java.util.Optional;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.minilms.api.dto.file.CloudinaryUploadResult;
import com.minilms.api.entities.Adjunto;
import com.minilms.api.repository.AdjuntoRepository;

import jakarta.transaction.Transactional;

@Service
public class FileService {
    private static final Logger logger = LoggerFactory.getLogger(FileService.class);

    @Autowired
    private CloudinaryService cloudinaryService;

    @Autowired
    private AdjuntoRepository adjuntoRepository;

    @Transactional
    public Optional<Adjunto> uploadFile(MultipartFile file) {
        try {
            if (file == null || file.isEmpty()) {
                logger.warn("No se puede subir un archivo vacio");
                return Optional.empty();
            }

            CloudinaryUploadResult uploadResult = cloudinaryService.uploadFile(file);

            Adjunto adjunto = new Adjunto();
            adjunto.setUrl(uploadResult.getSecureUrl());
            adjunto.setPublicId(uploadResult.getPublicId());
            adjunto.setFormato(uploadResult.getFormato());
            adjunto.setTipoArchivo(uploadResult.getTipoArchivo());
            adjunto.setTamano(uploadResult.getTamano());
            adjunto.setNombreOriginal(uploadResult.getNombreOriginal());

            Adjunto adjuntoGuardado = adjuntoRepository.save(adjunto);

            return Optional.of(adjuntoGuardado);
        } catch (IOException e) {
            logger.error("Error al subir archivo a Cloudinary", e);
            return Optional.empty();
        } catch (Exception e) {
            logger.error("Error inesperado al subir archivo", e);
            return Optional.empty();
        }

    }

    @Transactional
    public boolean deleteFile(Long adjuntoId) {
        try {
            logger.info("Eliminando adjunto con id: " + adjuntoId);
            Optional<Adjunto> findAdjunto = adjuntoRepository.findById(adjuntoId);
            if (findAdjunto.isEmpty()) {
                logger.warn("Adjunto no encontrado");
                return false;
            }
            Adjunto adjunto = findAdjunto.get();
            String resourceType = adjunto.getTipoArchivo().equals("imagen") ? "image" : "raw";
            cloudinaryService.deleteFile(adjunto.getPublicId(), resourceType);
            adjuntoRepository.delete(adjunto);
            return true;

        } catch (IOException e) {
            logger.error("Error al eliminar archivo de Cloudinary", e);
            throw new RuntimeException("Error al eliminar archivo", e);
        } catch (Exception e) {
            logger.error("Error inesperado al eliminar archivo", e);
            throw new RuntimeException("Error inesperado", e);
        }
    }

}
