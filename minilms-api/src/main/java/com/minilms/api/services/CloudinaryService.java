package com.minilms.api.services;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.minilms.api.dto.file.CloudinaryUploadResult;
import com.minilms.api.utils.LmsUtils;

import jakarta.annotation.PostConstruct;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;


@Service
public class CloudinaryService extends LmsUtils {

    @Value("${cloudinary.cloud-name}")
    private String cloudName;

    @Value("${cloudinary.api-key}")
    private String apiKey;

    @Value("${cloudinary.api-secret}")
    private String apiSecret;

    private Cloudinary cloudinary;

    @PostConstruct
    public void init() {
        this.cloudinary = new Cloudinary(ObjectUtils.asMap(
                "cloud_name", cloudName,
                "api_key", apiKey,
                "api_secret", apiSecret));
    }

    public CloudinaryUploadResult uploadFile(MultipartFile file) throws IOException {

        String resourceType = getResourceType(file.getContentType());

        Map<?, ?> uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                "resource_type", resourceType));

        CloudinaryUploadResult result = new CloudinaryUploadResult();
        result.setSecureUrl(aString(uploadResult.get("secure_url")));
        result.setPublicId(aString(uploadResult.get("public_id")));
        result.setFormato(aString(uploadResult.get("format"), file.getContentType()));
        result.setTamano(aLong(uploadResult.get("bytes")));
        result.setNombreOriginal(file.getOriginalFilename());

        result.setTipoArchivo(getTipoArchivo(file.getContentType()));

        return result;
    }

    private String getResourceType(String contentType) {
        if (contentType != null) {
            if (contentType.startsWith("image/")) {
                return "image";
            } else if (contentType.startsWith("video/")) {
                return "video";
            } else if (contentType.startsWith("application/pdf") ||
                    contentType.startsWith("application/msword") ||
                    contentType.startsWith("application/vnd.openxmlformats-officedocument")) {
                return "raw"; // documentos: pdf, word, excel
            }
        }
        return "raw"; // por defecto
    }

    private String getTipoArchivo(String contentType) {
        if (contentType != null) {
            if (contentType.startsWith("image/")) {
                return "imagen";
            } else if (contentType.startsWith("video/")) {
                return "video";
            } else if (contentType.startsWith("audio/")) {
                return "audio";
            } else if (contentType.equals("application/pdf")) {
                return "pdf";
            } else if (contentType.equals("application/msword") ||
                    contentType.equals("application/vnd.openxmlformats-officedocument.wordprocessingml.document")) {
                return "word";
            } else if (contentType.equals("application/vnd.ms-excel") ||
                    contentType.equals("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet")) {
                return "excel";
            }
        }
        return "otro";
    }

    @SuppressWarnings("rawtypes")
    public void deleteFile(String publicId, String resourceType) throws IOException {
        Map options = ObjectUtils.asMap("resource_type", resourceType);
        cloudinary.uploader().destroy(publicId, options);
    }

}
