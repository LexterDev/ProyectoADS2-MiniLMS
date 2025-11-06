package com.minilms.api.dto.file;

import org.springframework.lang.NonNull;
import org.springframework.web.multipart.MultipartFile;
import java.io.*;

public class Base64MultipartFile implements MultipartFile {

    private final byte[] content;
    private final String name;
    private final String contentType;
    private final long size;

    public Base64MultipartFile(byte[] content, String name, String contentType, long size) {
        this.content = content;
        this.name = name;
        this.contentType = contentType;
        this.size = size;
    }

    @Override
    public @NonNull String getName() {
        return name;
    }

    @Override
    public String getOriginalFilename() {
        return name;
    }

    @Override
    public String getContentType() {
        return contentType;
    }

    @Override
    public boolean isEmpty() {
        return content == null || content.length == 0;
    }

    @Override
    public long getSize() {
        return size;
    }

    @Override
    public @NonNull byte[] getBytes() throws IOException {
        return content;
    }

    @Override
    public @NonNull InputStream getInputStream() throws IOException {
        return new ByteArrayInputStream(content);
    }

    @Override
    public void transferTo(@NonNull File dest) throws IOException, IllegalStateException {
        try (FileOutputStream fos = new FileOutputStream(dest)) {
            fos.write(content);
        }
    }
}