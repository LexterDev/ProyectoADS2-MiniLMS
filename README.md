# ProyectoADS2-MiniLMS
Mini-LMS para cursos online - Proyecto ADS II

## 🚀 Ejecución con Docker

El proyecto está configurado para ejecutarse con Docker y Docker Compose, con configuraciones separadas para entornos de desarrollo y producción.

### Requisitos Previos

*   [Docker](https://www.docker.com/get-started) instalado.
*   [Docker Compose](https://docs.docker.com/compose/install/) (incluido con Docker Desktop).

### ⚙️ Configuración Inicial

Antes de iniciar, es necesario configurar las variables de entorno.

1.  Navega al directorio `minilms-api`.
2.  Crea un archivo llamado `.env` y añade el siguiente contenido. **Asegúrate de que `DOCKER_REGISTRY` coincida con tu nombre de usuario de Docker Hub.**

    ```env
    # PostgreSQL Database settings
    POSTGRES_DB=minilmsdb
    POSTGRES_USER=admin
    POSTGRES_PASSWORD=adminpass

    # Docker Registry (tu usuario de Docker Hub, ej: noerodas)
    DOCKER_REGISTRY=tu-usuario-de-dockerhub

    # JWT Secret (cambia esto por una clave segura y larga en producción)
    JWT_SECRET=unaClaveSecretaParaDesarrollo
    ```

### 💻 Entorno de Desarrollo (Local)

Este modo construye la imagen de la API localmente y expone el puerto de la base de datos, permitiendo la conexión con herramientas externas como DBeaver.

1.  Abre una terminal en el directorio `minilms-api`.
2.  Ejecuta el siguiente comando para construir e iniciar los contenedores:

    ```bash
    # Forma corta (recomendada)
    docker-compose up --build
    ```
    *   Este comando combina automáticamente `docker-compose.yml` (base) y `docker-compose.override.yml` (desarrollo).

    **Alternativa explícita:**
    Si prefieres especificar los archivos manualmente (útil para claridad o debugging), puedes usar el siguiente comando, que tiene el mismo efecto que el anterior:

    ```bash
    docker-compose -f docker-compose.yml -f docker-compose.override.yml up --build
    ```
    *   Para ejecutar cualquiera de los comandos en segundo plano, añade la bandera `-d`.

### ☁️ Entorno de Producción / Staging (Remoto)

Este modo utiliza una imagen pre-construida de un registro de contenedores (como Docker Hub).

1.  **Paso Previo: Construir y Subir la Imagen**

    ```bash
    # 1. Inicia sesión en tu registro
    docker login

    # 2. Construye y etiqueta la imagen (reemplaza 'tu-registro' con tu usuario de Docker Hub)
    docker build -t tu-registro/minilms-api:latest ./minilms-api

    # 3. Sube la imagen
    docker push tu-registro/minilms-api:latest
    ```

2.  **Desplegar en el Servidor**

    ```bash
    docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
    ```

### Acceso a los Servicios

*   **API**: Disponible en `http://localhost:8080` (o la IP del servidor).
*   **Base de Datos (solo en desarrollo)**:
    *   **Host**: `localhost`
    *   **Puerto**: `5433`
    *   **Credenciales**: Las definidas en tu archivo `.env`.

### Detener los Servicios

*   **Desarrollo**: `docker-compose down`
*   **Producción**: `docker-compose -f docker-compose.yml -f docker-compose.prod.yml down`