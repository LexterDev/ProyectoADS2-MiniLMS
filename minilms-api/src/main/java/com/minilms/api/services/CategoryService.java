package com.minilms.api.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.minilms.api.dto.catalog.CategoryDTO;
import com.minilms.api.entities.Categoria;
import com.minilms.api.mappers.CategoryMapper;
import com.minilms.api.repository.CategoriaRepository;
import com.minilms.api.repository.CursoRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoriaRepository repository;
    private final CursoRepository cursoRepository;

    @Transactional(readOnly = true)
    public List<CategoryDTO> findAll() {
        return repository.findAll().stream()
                .map(entity -> {
                    CategoryDTO dto = CategoryMapper.toDTO(entity);
                    dto.setCursosCount((int) cursoRepository.countByCategoriaId(entity.getId()));
                    return dto;
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CategoryDTO> findActiveCategories() {
        return repository.findAll().stream()
                .filter(cat -> cat.getActiva() == 1)
                .map(entity -> {
                    CategoryDTO dto = CategoryMapper.toDTO(entity);
                    dto.setCursosCount((int) cursoRepository.countByCategoriaId(entity.getId()));
                    return dto;
                })
                .toList();
    }

    @Transactional(readOnly = true)
    public CategoryDTO findById(Long id) {
        Categoria entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + id));
        CategoryDTO dto = CategoryMapper.toDTO(entity);
        dto.setCursosCount((int) cursoRepository.countByCategoriaId(id));
        return dto;
    }

    @Transactional
    public CategoryDTO create(CategoryDTO categoryDTO) {
        Categoria entity = CategoryMapper.toEntity(categoryDTO);
        entity.setId(null); // Ensure it's a new entity
        Categoria saved = repository.save(entity);
        return CategoryMapper.toDTO(saved);
    }

    @Transactional
    public CategoryDTO update(Long id, CategoryDTO categoryDTO) {
        Categoria existing = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + id));

        existing.setNombre(categoryDTO.getNombre());
        existing.setDescripcion(categoryDTO.getDescripcion());
        existing.setIcono(categoryDTO.getIcono());
        existing.setColor(categoryDTO.getColor());

        if (categoryDTO.getActiva() != null) {
            existing.setActiva(categoryDTO.getActiva());
        }

        Categoria updated = repository.save(existing);
        CategoryDTO dto = CategoryMapper.toDTO(updated);
        dto.setCursosCount((int) cursoRepository.countByCategoriaId(id));
        return dto;
    }

    @Transactional
    public void delete(Long id) {
        Categoria entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + id));

        long coursesCount = cursoRepository.countByCategoriaId(id);
        if (coursesCount > 0) {
            throw new RuntimeException("No se puede eliminar la categoría porque tiene " + coursesCount + " cursos asociados");
        }

        repository.delete(entity);
    }

    @Transactional
    public CategoryDTO toggleStatus(Long id) {
        Categoria entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Categoría no encontrada con ID: " + id));

        entity.setActiva((short) (entity.getActiva() == 1 ? 0 : 1));
        Categoria updated = repository.save(entity);
        CategoryDTO dto = CategoryMapper.toDTO(updated);
        dto.setCursosCount((int) cursoRepository.countByCategoriaId(id));
        return dto;
    }

}
