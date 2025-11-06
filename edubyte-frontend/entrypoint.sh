#!/bin/sh

# El modo por defecto es 'development'
# En Render, estableceremos ENV_MODE=production
if [ "$ENV_MODE" = "production" ]; then
  # MODO PRODUCCIÓN (RENDER)
  echo "Running in PRODUCTION mode."

  # 1. Eliminar el bloque del proxy de Nginx, ya que no es necesario.
  # Usa 'sed' para encontrar la línea 'location /api/ {' y eliminar hasta el '}' correspondiente.
  sed -i '/location \/api\//,/}/d' /etc/nginx/conf.d/default.conf
  echo "Nginx proxy for /api/ has been removed."

  # 2. Reemplazar la URL de la API en los archivos de Angular.
  # Asegúrate de que la variable NG_API_URL esté definida en Render.
  echo "Replacing API URL placeholder with: $API_URL"
  find /usr/share/nginx/html -type f -name "*.js" -exec sed -i "s|http://localhost:8080/api|${API_URL}|g" {} +

else
  # MODO DESARROLLO (DOCKER COMPOSE LOCAL)
  echo "Running in DEVELOPMENT mode. Nginx proxy for /api/ is active."
  # No se hace nada, se usa el nginx.conf original con el proxy a http://api:8080
fi

# Inicia Nginx en primer plano para mantener el contenedor corriendo
echo "Starting Nginx..."
nginx -g 'daemon off;'