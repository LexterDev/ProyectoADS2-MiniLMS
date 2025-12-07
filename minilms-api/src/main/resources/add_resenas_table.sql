-- -----------------------------------------------------------------
-- MIGRATION SCRIPT: Add resenas (reviews) table
-- -----------------------------------------------------------------
-- This script creates the resenas table for the reviews/ratings system
-- Run this script manually in your PostgreSQL database if the table doesn't exist

CREATE TABLE IF NOT EXISTS resenas (
    resena_id BIGSERIAL PRIMARY KEY,
    calificacion INTEGER NOT NULL CHECK (calificacion >= 1 AND calificacion <= 5),
    comentario VARCHAR(900),
    usuario_id BIGINT NOT NULL,
    curso_id BIGINT NOT NULL,
    creado_en TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    actualizado_en TIMESTAMP,
    CONSTRAINT fk_resena_usuario FOREIGN KEY (usuario_id) REFERENCES usuarios(usuario_id) ON DELETE CASCADE,
    CONSTRAINT fk_resena_curso FOREIGN KEY (curso_id) REFERENCES cursos(curso_id) ON DELETE CASCADE,
    CONSTRAINT uk_resena_usuario_curso UNIQUE (usuario_id, curso_id)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_resenas_curso ON resenas(curso_id);
CREATE INDEX IF NOT EXISTS idx_resenas_usuario ON resenas(usuario_id);

-- Add comment to the table
COMMENT ON TABLE resenas IS 'Tabla para almacenar reseñas y calificaciones de cursos por estudiantes';
COMMENT ON COLUMN resenas.calificacion IS 'Calificación del 1 al 5';
COMMENT ON COLUMN resenas.comentario IS 'Comentario opcional del estudiante (máximo 900 caracteres)';
