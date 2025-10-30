# ProyectoADS2-MiniLMS
Mini-LMS para cursos online - Proyecto ADS II


## Configuración del Entorno Local con Docker

El proyecto utiliza Docker y Docker Compose para simplificar la configuración del entorno de desarrollo. Las siguientes instrucciones aplican al servicio `minilms-api`.

### Prerrequisitos

*   [Docker Desktop](https://www.docker.com/products/docker-desktop/) instalado y en ejecución.

### Pasos para la Instalación

1.  **Navegar al Directorio de la API**

    Abre una terminal y sitúate en el directorio `minilms-api`.

    ```bash
    cd minilms-api
    ```

2.  **Configurar Variables de Entorno**

    El proyecto necesita un archivo `.env` para las credenciales de la base de datos. Crea una copia del archivo de ejemplo:

    ```bash
    # En Windows (PowerShell)
    cp .env.example .env

    # En Windows (Command Prompt)
    copy .env.example .env
    ```

    Los valores por defecto en el archivo `.env` son suficientes para iniciar.

3.  **Levantar los Contenedores**

    Ejecuta el siguiente comando para construir la imagen de la API y levantar los contenedores de la aplicación y la base de datos.

    ```bash
    docker-compose up --build -d
    ```

    *   `--build`: Reconstruye la imagen de la API si hay cambios en el código.
    *   `-d`: Ejecuta los contenedores en segundo plano.

4.  **Verificar el Estado**

    Comprueba que los contenedores estén en ejecución:

    ```bash
    docker-compose ps
    ```

    Deberías ver dos servicios (`minilms-api` y `minilms-db`) con el estado `running`.

### Acceso a los Servicios

*   **API**: Disponible en `http://localhost:8080`.
*   **Base de Datos**: Puedes conectarte usando los siguientes datos:
    *   **Host**: `localhost`
    *   **Puerto**: `5433`
    *   **Usuario/Contraseña/BD**: Los definidos en tu archivo `.env`.

### Detener el Entorno

Para detener todos los servicios, ejecuta desde el directorio `minilms-api`:

```bash
docker-compose down
```