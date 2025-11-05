# ProyectoADS2-MiniLMS
Mini-LMS para cursos online - Proyecto ADS II

Este proyecto está configurado para ser levantado y ejecutado fácilmente usando Docker y Docker Compose.

## 🌐 URLs de Producción (Despliegue en Render)

La aplicación está desplegada en Render y se puede acceder a través de los siguientes enlaces:

-   **Frontend (Aplicación en vivo)**: [`https://minilms-frontend.onrender.com/`](https://minilms-frontend.onrender.com/)
-   **Backend (API en vivo)**: [`https://proyectoads2-minilms.onrender.com/`](https://proyectoads2-minilms.onrender.com/)
-   **Documentación de la API (Producción)**: [`https://proyectoads2-minilms.onrender.com/swagger-ui/index.html`](https://proyectoads2-minilms.onrender.com/swagger-ui/index.html)

---

## 🐳 Ejecución del Proyecto en Local

A continuación se describen los pasos para ejecutar el proyecto en un entorno de desarrollo local.

### 1. Requisitos Previos

-   [Docker](https://www.docker.com/get-started) instalado (versión 20.10 o superior).
-   [Docker Compose](https://docs.docker.com/compose/install/) (generalmente viene incluido con Docker Desktop).

### 2. Clonar el Repositorio

Abre una terminal y ejecuta:
```bash
git clone https://github.com/noerodas/ProyectoADS2-MiniLMS.git
cd ProyectoADS2-MiniLMS
```
*(Nota: Reemplaza `noerodas` con el usuario correcto si el repositorio está en otro lugar).*

### 3. Elegir un Método de Ejecución

Existen dos maneras de levantar el proyecto en local:

#### Método 1: Modo Desarrollo (Recomendado)

Este método construye las imágenes de Docker directamente desde el código fuente local. Es la forma estándar de trabajar en el proyecto, hacer cambios y probarlos.

**Comando:**
```bash
docker-compose up --build
```
La primera vez que lo ejecutes puede tardar varios minutos mientras se descargan las imágenes base y se construyen los servicios.

#### Método 2: Modo Producción Simulado

Este método no construye nada. Descarga y ejecuta las imágenes exactas que fueron publicadas en el registro público de Docker Hub (`noerodas/minilms-api` y `noerodas/minilms-frontend`). Es útil para verificar la versión estable publicada sin necesidad de construirla.

**Comando:**
```bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### 4. Acceso a los Servicios Locales

Una vez que los contenedores estén corriendo, podrás acceder a los servicios desde tu navegador:

-   **Frontend (la aplicación web)**: [`http://localhost:4200`](http://localhost:4200)
-   **API (el backend)**: [`http://localhost:8080`](http://localhost:8080)
-   **Documentación de la API (Swagger UI)**: [`http://localhost:8080/swagger-ui/index.html`](http://localhost:8080/swagger-ui/index.html)

### 5. Poblado de Datos de Prueba

Al levantar los contenedores por primera vez, la base de datos se crea vacía. Para poder utilizar la aplicación, es necesario poblarla con datos de prueba.

1.  **Abre la Documentación de la API Local:** [`http://localhost:8080/swagger-ui/index.html`](http://localhost:8080/swagger-ui/index.html)
2.  **Encuentra el Endpoint:** Busca el controlador `test-controller` y expande el endpoint `POST /api/test/dataSeed`.
3.  **Ejecuta el Endpoint:** Haz clic en "Try it out" y luego en "Execute".

Una vez ejecutado, se crearán los siguientes usuarios de prueba. La contraseña para **todos** es: `administrador`

-   **Administrador**: `admin@edubyte.com`
-   **Instructor**: `instructor@edubyte.com`
-   **Estudiante**: `student@edubyte.com`

## 🔧 Comandos Útiles de Docker

-   **Ver estado de los contenedores:** `docker-compose ps`
-   **Ver logs en tiempo real:** `docker-compose logs -f`
-   **Detener todos los servicios:** `docker-compose down`
-   **Detener y eliminar volúmenes de datos (¡borra la BD!):** `docker-compose down -v`