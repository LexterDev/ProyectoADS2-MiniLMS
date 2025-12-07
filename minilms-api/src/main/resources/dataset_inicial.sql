-- -----------------------------------------------------------------
-- MINILMS - SCRIPT DE DATOS INICIALES
-- -----------------------------------------------------------------
TRUNCATE TABLE
    pagos,
    resenas,
    inscripciones_progreso,
    inscripciones,
    cursos_lecciones,
    cursos_secciones,
    cursos,
    adjunto,
    usuarios,
    cursos_categorias,
    formas_pago,
    estados,
    roles
RESTART IDENTITY CASCADE;


-- NOTA: Se asume que las tablas están vacías.
-- Los IDs (IDENTITY) se generarán secuencialmente (1, 2, 3...).

-- 1. DATOS MAESTROS (SIN DEPENDENCIAS)
-- -----------------------------------------------------------------

INSERT INTO roles (codigo, descripcion)
VALUES
('ESTUDIANTE', 'Rol para estudiantes inscritos'),
('INSTRUCTOR', 'Rol para creadores de cursos'),
('ADMINISTRADOR', 'Rol de superusuario');

INSERT INTO estados (codigo, descripcion)
VALUES
('ACT', 'Activo'),
('INA', 'Inactivo'),
('BOR', 'Borrador'),
('REV', 'En Revisión'),
('PUB', 'Publicado'),
('INS', 'Inscrito'),
('COMPLETADO', 'Completado');

INSERT INTO cursos_categorias (nombre, descripcion)
VALUES
('Desarrollo Web', 'Cursos de programación frontend y backend'),
('Diseño UX/UI', 'Cursos de diseño, prototipado y experiencia de usuario'),
('Negocios y Finanzas', 'Cursos de administración, marketing y finanzas');

INSERT INTO formas_pago (forma_pago_id, nombre)
VALUES
('TARJETA', 'Tarjeta de Crédito/Débito'),
('PAYPAL', 'PayPal'),
('TRANSFERENCIA', 'Transferencia Bancaria');

-- 2. USUARIOS
-- -----------------------------------------------------------------
-- Se crean 1 Administrador, 2 Instructores y 3 Estudiantes.

-- Administrador (El ID 1 será 'Admin')
INSERT INTO usuarios (nombre, apellido, correo, clave, rol_id, estado_id, creado_en)
VALUES
('Admin', 'MiniLMS', 'admin@minilms.com', '$2a$10$RfhXx/dOuTEzkNPiUJhDZu06HM8RtPwi1JUCoDoKeJ9iw6c5NZDg.', 'ADMINISTRADOR', 'ACT', CURRENT_TIMESTAMP);

-- Instructores (Iniciarán en ID 2)
INSERT INTO usuarios (nombre, apellido, correo, clave, rol_id, estado_id, creado_en)
VALUES
('David', 'Instructor', 'instructor@minilms.com', '$2a$10$RfhXx/dOuTEzkNPiUJhDZu06HM8RtPwi1JUCoDoKeJ9iw6c5NZDg.', 'INSTRUCTOR', 'ACT', CURRENT_TIMESTAMP),
('Maria', 'Maestra', 'maria.profe@minilms.com', '$2a$10$RfhXx/dOuTEzkNPiUJhDZu06HM8RtPwi1JUCoDoKeJ9iw6c5NZDg.', 'INSTRUCTOR', 'ACT', CURRENT_TIMESTAMP);

-- Estudiantes (Iniciarán en ID 4)
INSERT INTO usuarios (nombre, apellido, correo, clave, rol_id, estado_id, creado_en)
VALUES
('Jose', 'Estudiante', 'estudiante@minilms.com', '$2a$10$RfhXx/dOuTEzkNPiUJhDZu06HM8RtPwi1JUCoDoKeJ9iw6c5NZDg.', 'ESTUDIANTE', 'ACT', CURRENT_TIMESTAMP),
('Ana', 'Alumna', 'ana.alumna@minilms.com', '$2a$10$RfhXx/dOuTEzkNPiUJhDZu06HM8RtPwi1JUCoDoKeJ9iw6c5NZDg.', 'ESTUDIANTE', 'ACT', CURRENT_TIMESTAMP),
('Carlos', 'Aprendiz', 'carlos.ap@minilms.com', '$2a$10$RfhXx/dOuTEzkNPiUJhDZu06HM8RtPwi1JUCoDoKeJ9iw6c5NZDg.', 'ESTUDIANTE', 'ACT', CURRENT_TIMESTAMP);

-- 3. ADJUNTOS (OPCIONAL)
-- -----------------------------------------------------------------
-- Se crea 1 adjunto para la portada del curso 1
INSERT INTO adjunto (url, public_id, tipo_archivo, formato, tamano, nombre_original) 
VALUES 
('https://res.cloudinary.com/djqtf9mwo/image/upload/v1762105989/g2wohszwto5wxcn8sumn.jpg', 'g2wohszwto5wxcn8sumn', 'imagen', 'image/jpeg', 822023, 'security.jpg');


-- 4. CURSOS
-- -----------------------------------------------------------------
-- Se usan los IDs de usuario (2 = David Instructor) y categoría (1 = Desarrollo Web, 2 = Diseño)
-- Se usan los estados 'PUB' (Publicado) y 'BOR' (Borrador)
INSERT INTO cursos (titulo, descripcion, precio, estado_id, instructor_id, categoria_id, adjunto_id, eliminado)
VALUES
('Curso de Java 21', 'Aprende las novedades de Java 21', 129.99, 'PUB', 2, 1, 1, 0),
('Spring Boot 3 Avanzado', 'Microservicios con Spring Boot y Spring Cloud', 149.50, 'PUB', 2, 1, null, 0),
('Fundamentos de React', 'Crea interfaces de usuario modernas con React', 99.00, 'BOR', 2, 1, null, 0);

-- 5. SECCIONES
-- -----------------------------------------------------------------
-- Se asume que los cursos anteriores son ID 1, 2, 3
-- Y que las secciones se autoincrementarán 1, 2, 3...

-- CURSO 1 (Java 21)
INSERT INTO cursos_secciones (titulo, orden, duracion_estimada, visible, curso_id) VALUES ('Introducción a Java 21', 1, 15, true, 1);
INSERT INTO cursos_secciones (titulo, orden, duracion_estimada, visible, curso_id) VALUES ('Conceptos Básicos de Java', 2, 45, true, 1);
INSERT INTO cursos_secciones (titulo, orden, duracion_estimada, visible, curso_id) VALUES ('Programación Orientada a Objetos', 3, 60, true, 1);

-- CURSO 2 (Spring Boot 3)
INSERT INTO cursos_secciones (titulo, orden, duracion_estimada, visible, curso_id) VALUES ('Introducción a Spring Boot 3', 1, 30, true, 2);
INSERT INTO cursos_secciones (titulo, orden, duracion_estimada, visible, curso_id) VALUES ('Microservicios con Spring Cloud', 2, 75, true, 2);

-- CURSO 3 (React)
INSERT INTO cursos_secciones (titulo, orden, duracion_estimada, visible, curso_id) VALUES ('Bienvenida a React', 1, 20, true, 3);
INSERT INTO cursos_secciones (titulo, orden, duracion_estimada, visible, curso_id) VALUES ('Componentes, Props y Estado', 2, 50, true, 3);


-- 6. LECCIONES
-- -----------------------------------------------------------------
-- Se asume que las secciones anteriores son ID 1, 2, 3, 4, 5, 6, 7

-- Lecciones para la Sección 1 (Java - Intro)
INSERT INTO cursos_lecciones (titulo, url, contenido, orden, tipo, visible, seccion_id) 
VALUES ('¿Qué es Java?', 'https://videos.example.com/java-intro.mp4', null, 1, 'VIDEO', true, 1);
INSERT INTO cursos_lecciones (titulo, url, contenido, orden, tipo, visible, seccion_id) 
VALUES ('Lectura: Novedades en Java 21', null, 'Java 21 introduce String Templates (preview), Virtual Threads, y más...', 2, 'LECTURA', true, 1);
INSERT INTO cursos_lecciones (titulo, url, contenido, orden, tipo, visible, seccion_id) 
VALUES ('Instalación del JDK', 'https://videos.example.com/java-install.mp4', null, 3, 'VIDEO', true, 1);

-- Lecciones para la Sección 2 (Java - Básicos)
INSERT INTO cursos_lecciones (titulo, url, contenido, orden, tipo, visible, seccion_id) 
VALUES ('Variables y Tipos de Datos', 'https://videos.example.com/java-vars.mp4', null, 1, 'VIDEO', true, 2);
INSERT INTO cursos_lecciones (titulo, url, contenido, orden, tipo, visible, seccion_id) 
VALUES ('Operadores', 'https://videos.example.com/java-ops.mp4', null, 2, 'VIDEO', true, 2);
INSERT INTO cursos_lecciones (titulo, url, contenido, orden, tipo, visible, seccion_id) 
VALUES ('Lectura: Palabras Reservadas', null, 'Las palabras reservadas como public, class, static... no pueden ser usadas como nombres de variables.', 3, 'LECTURA', true, 2);

-- Lecciones para la Sección 3 (Java - POO)
INSERT INTO cursos_lecciones (titulo, url, contenido, orden, tipo, visible, seccion_id) 
VALUES ('Clases y Objetos', 'https://videos.example.com/java-oop1.mp4', null, 1, 'VIDEO', true, 3);
INSERT INTO cursos_lecciones (titulo, url, contenido, orden, tipo, visible, seccion_id) 
VALUES ('Herencia', 'https://videos.example.com/java-oop2.mp4', null, 2, 'VIDEO', true, 3);
INSERT INTO cursos_lecciones (titulo, url, contenido, orden, tipo, visible, seccion_id) 
VALUES ('Polimorfismo y Encapsulamiento', 'https://videos.example.com/java-oop3.mp4', null, 3, 'VIDEO', true, 3);

-- Lecciones para la Sección 4 (Spring - Intro)
INSERT INTO cursos_lecciones (titulo, url, contenido, orden, tipo, visible, seccion_id) 
VALUES ('¿Qué es Spring Boot?', 'https://videos.example.com/spring-intro.mp4', null, 1, 'VIDEO', true, 4);
INSERT INTO cursos_lecciones (titulo, url, contenido, orden, tipo, visible, seccion_id) 
VALUES ('Inyección de Dependencias', 'https://videos.example.com/spring-di.mp4', null, 2, 'VIDEO', true, 4);
INSERT INTO cursos_lecciones (titulo, url, contenido, orden, tipo, visible, seccion_id) 
VALUES ('Lectura: Novedades en Spring Boot 3', null, 'Spring Boot 3 requiere Java 17+ y migra de JavaEE a JakartaEE.', 3, 'LECTURA', true, 4);

-- Lecciones para la Sección 5 (Spring - Microservicios)
INSERT INTO cursos_lecciones (titulo, url, contenido, orden, tipo, visible, seccion_id) 
VALUES ('Arquitectura de Microservicios', 'https://videos.example.com/spring-ms.mp4', null, 1, 'VIDEO', true, 5);
INSERT INTO cursos_lecciones (titulo, url, contenido, orden, tipo, visible, seccion_id) 
VALUES ('Spring Cloud Gateway', 'https://videos.example.com/spring-gateway.mp4', null, 2, 'VIDEO', true, 5);

-- Lecciones para la Sección 6 (React - Intro)
INSERT INTO cursos_lecciones (titulo, url, contenido, orden, tipo, visible, seccion_id) 
VALUES ('¿Qué es React?', 'https://videos.example.com/react-intro.mp4', null, 1, 'INTRODUCCION', true, 6);
INSERT INTO cursos_lecciones (titulo, url, contenido, orden, tipo, visible, seccion_id) 
VALUES ('Instalación con Vite', 'https://videos.example.com/react-vite.mp4', null, 2, 'VIDEO', true, 6);

-- Lecciones para la Sección 7 (React - Componentes)
INSERT INTO cursos_lecciones (titulo, url, contenido, orden, tipo, visible, seccion_id) 
VALUES ('Componentes Funcionales', 'https://videos.example.com/react-comps.mp4', null, 1, 'VIDEO', true, 7);
INSERT INTO cursos_lecciones (titulo, url, contenido, orden, tipo, visible, seccion_id) 
VALUES ('Manejo de Props', 'https://videos.example.com/react-props.mp4', null, 2, 'VIDEO', true, 7);
INSERT INTO cursos_lecciones (titulo, url, contenido, orden, tipo, visible, seccion_id) 
VALUES ('Lectura: El Hook useState', null, 'useState nos permite añadir estado a nuestros componentes funcionales...', 3, 'LECTURA', true, 7);


-- 7. INSCRIPCIONES
-- -----------------------------------------------------------------
-- Inscribimos a los estudiantes (IDs 4, 5, 6) en los cursos (IDs 1, 2)
-- Se asume que las inscripciones serán ID 1, 2, 3, 4

-- Jose (ID 4) se inscribe en Curso 1
INSERT INTO inscripciones (progreso, estado_id, estudiante_id, curso_id, completado)
VALUES (0, 'INS', 4, 1, false);

-- Ana (ID 5) se inscribe en Curso 1 y 2
INSERT INTO inscripciones (progreso, estado_id, estudiante_id, curso_id, completado)
VALUES (0, 'INS', 5, 1, false);
INSERT INTO inscripciones (progreso, estado_id, estudiante_id, curso_id, completado)
VALUES (0, 'INS', 5, 2, false);

-- Carlos (ID 6) se inscribe en Curso 2 y 3
INSERT INTO inscripciones (progreso, estado_id, estudiante_id, curso_id, completado)
VALUES (0, 'INS', 6, 2, false);
INSERT INTO inscripciones (progreso, estado_id, estudiante_id, curso_id, completado)
VALUES (0, 'INS', 6, 3, false);


-- 8. PROGRESO DE LECCIONES
-- -----------------------------------------------------------------
-- Se asume que las inscripciones son ID 1, 2, 3, 4, 5
-- Se asume que las lecciones son ID 1 a 19

-- Jose (Inscripción ID 1) completa 2 lecciones del Curso 1
-- Lecciones IDs 1, 2
INSERT INTO inscripciones_progreso (inscripcion_id, leccion_id, completado, fecha_completado) VALUES (1, 1, true, CURRENT_TIMESTAMP);
INSERT INTO inscripciones_progreso (inscripcion_id, leccion_id, completado, fecha_completado) VALUES (1, 2, true, CURRENT_TIMESTAMP);

-- Ana (Inscripción ID 2) completa la primera sección del Curso 1
-- Lecciones IDs 1, 2, 3
INSERT INTO inscripciones_progreso (inscripcion_id, leccion_id, completado, fecha_completado) VALUES (2, 1, true, CURRENT_TIMESTAMP);
INSERT INTO inscripciones_progreso (inscripcion_id, leccion_id, completado, fecha_completado) VALUES (2, 2, true, CURRENT_TIMESTAMP);
INSERT INTO inscripciones_progreso (inscripcion_id, leccion_id, completado, fecha_completado) VALUES (2, 3, true, CURRENT_TIMESTAMP);

-- Ana (Inscripción ID 3) completa 1 lección del Curso 2
-- Lección ID 10
INSERT INTO inscripciones_progreso (inscripcion_id, leccion_id, completado, fecha_completado) VALUES (3, 10, true, CURRENT_TIMESTAMP);

-- Carlos (Inscripción ID 5) completa TODO el Curso 3 (5 lecciones)
-- Lecciones IDs 15, 16, 17, 18, 19
INSERT INTO inscripciones_progreso (inscripcion_id, leccion_id, completado, fecha_completado) VALUES (5, 15, true, CURRENT_TIMESTAMP);
INSERT INTO inscripciones_progreso (inscripcion_id, leccion_id, completado, fecha_completado) VALUES (5, 16, true, CURRENT_TIMESTAMP);
INSERT INTO inscripciones_progreso (inscripcion_id, leccion_id, completado, fecha_completado) VALUES (5, 17, true, CURRENT_TIMESTAMP);
INSERT INTO inscripciones_progreso (inscripcion_id, leccion_id, completado, fecha_completado) VALUES (5, 18, true, CURRENT_TIMESTAMP);
INSERT INTO inscripciones_progreso (inscripcion_id, leccion_id, completado, fecha_completado, nota_evaluacion) VALUES (5, 19, true, CURRENT_TIMESTAMP, 85.0);


-- 9. ACTUALIZAR PROGRESO EN INSCRIPCIONES
-- -----------------------------------------------------------------
-- Se actualiza el campo 'progreso' en la tabla 'inscripciones' 
-- basado en los inserts anteriores.

-- Jose (Inscripción 1): 2 / 9 lecciones = 22%
UPDATE inscripciones SET progreso = 22 WHERE inscripcion_id = 1;

-- Ana (Inscripción 2): 3 / 9 lecciones = 33%
UPDATE inscripciones SET progreso = 33 WHERE inscripcion_id = 2;

-- Ana (Inscripción 3): 1 / 5 lecciones = 20%
UPDATE inscripciones SET progreso = 20 WHERE inscripcion_id = 3;

-- Carlos (Inscripción 5): 5 / 5 lecciones = 100%
UPDATE inscripciones SET progreso = 100, completado = true, fecha_fin_curso = CURRENT_TIMESTAMP WHERE inscripcion_id = 5;
