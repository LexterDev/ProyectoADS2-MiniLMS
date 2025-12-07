# Endpoints Pendientes del Backend - MiniLMS

## 📋 Resumen

Este documento lista los endpoints del backend que están siendo llamados desde el frontend pero que aún no están implementados o requieren ajustes.

---

## 🎯 Endpoints para el Sistema de Reproducción de Cursos

### 1. Marcar Lección como Completada

**Estado:** ❌ No implementado

**Descripción:** Endpoint para marcar una lección específica como completada por el estudiante.

**Método:** `POST`

**Ruta:** `/api/enroll/courses/{courseId}/lessons/{lessonId}/complete`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `courseId` (Long): ID del curso
- `lessonId` (Long): ID de la lección

**Response Esperada:**
```json
{
  "status": 200,
  "message": "Lección marcada como completada",
  "data": {
    "leccionId": 1,
    "completado": true,
    "fechaCompletado": "2025-11-27T14:30:00",
    "progresoCurso": 45.5
  }
}
```

**Ubicación en Frontend:**
- [course-player.component.ts:214-224](edubyte-frontend/src/app/pages/student/course-player/course-player.component.ts#L214-L224)
- Actualmente marcado como TODO

---

### 2. Obtener Primera/Siguiente Lección de un Curso

**Estado:** ❌ No implementado

**Descripción:** Endpoint para obtener la primera lección de un curso (si no se ha iniciado) o la siguiente lección a completar (si ya tiene progreso).

**Método:** `GET`

**Ruta:** `/api/enroll/courses/{courseId}/next-lesson`

**Headers:**
```
Authorization: Bearer {token}
```

**Path Parameters:**
- `courseId` (Long): ID del curso

**Response Esperada:**
```json
{
  "status": 200,
  "message": "Siguiente lección obtenida",
  "data": {
    "leccionId": 3,
    "seccionId": 1,
    "titulo": "Introducción a Variables",
    "orden": 3
  }
}
```

**Ubicación en Frontend:**
- [my-courses.component.ts:148-151](edubyte-frontend/src/app/pages/student/my-courses/my-courses.component.ts#L148-L151)
- Actualmente devuelve ID hardcodeado = 1

---

## 📊 Endpoints Existentes que se Están Usando

### 1. Actualizar Tiempo Dedicado

**Estado:** ✅ Implementado

**Ruta:** `POST /api/enroll/courses/{courseId}/time-spent`

**Body:**
```json
{
  "leccionId": 1,
  "tiempoDedicadoSegundos": 120
}
```

**Ubicación en Frontend:**
- [course-player.component.ts:354-366](edubyte-frontend/src/app/pages/student/course-player/course-player.component.ts#L354-L366)
- [progress.service.ts:42-52](edubyte-frontend/src/app/services/progress.service.ts#L42-L52)

**Notas:** Funciona correctamente, se llama cada 10 segundos durante la reproducción.

---

### 2. Obtener Tiempo Total Dedicado

**Estado:** ✅ Implementado

**Ruta:** `GET /api/enroll/courses/{courseId}/total-time`

**Ubicación en Frontend:**
- [progress.service.ts:54-63](edubyte-frontend/src/app/services/progress.service.ts#L54-L63)

---

## 🔄 Flujo Actual vs Flujo Deseado

### Flujo Actual
```
1. Usuario hace clic en "Comenzar" o "Continuar" en Mis Cursos
2. Frontend usa lessonId = 1 (hardcoded)
3. Se navega a /student/course/{courseId}/lesson/1
4. Se reproduce la lección
5. Se trackea tiempo cada 10 segundos ✅
6. Al marcar como completada, solo se actualiza localmente ❌
```

### Flujo Deseado
```
1. Usuario hace clic en "Comenzar" o "Continuar"
2. Frontend llama a GET /courses/{courseId}/next-lesson
3. Backend devuelve la lección correcta según progreso
4. Se navega a /student/course/{courseId}/lesson/{lessonId}
5. Se reproduce la lección
6. Se trackea tiempo cada 10 segundos ✅
7. Al marcar como completada:
   - Se llama a POST /courses/{courseId}/lessons/{lessonId}/complete
   - Backend actualiza estado de completado
   - Backend recalcula progreso del curso
   - Frontend avanza a siguiente lección
```

---

## 🛠️ Implementación Sugerida en Backend

### Controlador: `EnrollController.java`

```java
/**
 * Marcar una lección como completada
 */
@PostMapping("/courses/{courseId}/lessons/{lessonId}/complete")
public ResponseEntity<Object> markLessonComplete(
    @PathVariable Long courseId,
    @PathVariable Long lessonId,
    @RequestHeader("Authorization") String token
) {
    // Implementar lógica
    return ResponseHandler.generateResponse(
        "Lección marcada como completada",
        HttpStatus.OK,
        completionData
    );
}

/**
 * Obtener siguiente lección a completar
 */
@GetMapping("/courses/{courseId}/next-lesson")
public ResponseEntity<Object> getNextLesson(
    @PathVariable Long courseId,
    @RequestHeader("Authorization") String token
) {
    // Implementar lógica
    return ResponseHandler.generateResponse(
        "Siguiente lección obtenida",
        HttpStatus.OK,
        nextLessonData
    );
}
```

---

## 📝 Notas Adicionales

1. **Persistencia de Notas:** Actualmente las notas se guardan solo en localStorage del navegador. Para hacerlas persistentes entre dispositivos, se podría crear un endpoint adicional:
   - `POST /api/courses/{courseId}/lessons/{lessonId}/notes`
   - `GET /api/courses/{courseId}/lessons/{lessonId}/notes`
   - `DELETE /api/courses/{courseId}/lessons/{lessonId}/notes/{noteId}`

2. **Validaciones Necesarias:**
   - Verificar que el usuario esté inscrito en el curso
   - Verificar que la lección pertenezca al curso
   - Validar que no se marquen lecciones como completadas fuera de orden (opcional)

3. **Optimizaciones Futuras:**
   - Implementar caché para reducir llamadas al endpoint de tiempo dedicado
   - Batch updates para reducir carga en el servidor
   - WebSockets para actualizaciones en tiempo real del progreso

---

## ✅ Checklist de Implementación

- [ ] Implementar endpoint POST `/courses/{courseId}/lessons/{lessonId}/complete`
- [ ] Implementar endpoint GET `/courses/{courseId}/next-lesson`
- [ ] Crear tests unitarios para los nuevos endpoints
- [ ] Actualizar documentación de API (Swagger/OpenAPI)
- [ ] Probar integración con frontend
- [ ] Actualizar método `getFirstLessonId()` en frontend para usar el nuevo endpoint
- [ ] Actualizar método `markAsCompleted()` en frontend para llamar al endpoint real

---

**Fecha de Creación:** 2025-11-27
**Última Actualización:** 2025-11-27
**Responsable Backend:** Por asignar
**Responsable Frontend:** Completado ✅
