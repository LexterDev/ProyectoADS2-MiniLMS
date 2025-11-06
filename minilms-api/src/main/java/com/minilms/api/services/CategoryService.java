package com.minilms.api.services;

import java.util.List;

import org.springframework.stereotype.Service;

import com.minilms.api.dto.catalog.CategoryDTO;
import com.minilms.api.mappers.CategoryMapper;
import com.minilms.api.repository.CategoriaRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoriaRepository repository;

    public List<CategoryDTO> findAll() {
        return repository.findAll().stream().map(CategoryMapper::toDTO).toList();
    }

}
