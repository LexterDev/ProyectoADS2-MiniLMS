package com.minilms.api.services;

import org.springframework.stereotype.Service;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.core.io.ResourceLoader;
import org.springframework.core.io.Resource;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.FileCopyUtils;

import com.minilms.api.config.responseApi.ApiException;

import org.springframework.http.HttpStatus;

import lombok.RequiredArgsConstructor;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;

@Service
@RequiredArgsConstructor
public class DatabaseSeederService {

    private final JdbcTemplate jdbcTemplate;
    private final ResourceLoader resourceLoader;

    @Transactional
    public String seedDatabase() {
        try {
            Resource resource = resourceLoader.getResource("classpath:dataset_inicial.sql");
            String sqlScript;
            try (Reader reader = new InputStreamReader(resource.getInputStream(), StandardCharsets.UTF_8)) {
                sqlScript = FileCopyUtils.copyToString(reader);
            }
            jdbcTemplate.execute(sqlScript);

            return "Base de datos reseteada y poblada con éxito.";

        } catch (Exception e) {
            throw new ApiException("Error al ejecutar el script 'dataset_inicial.sql': " + e.getMessage(),
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}