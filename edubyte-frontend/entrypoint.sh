#!/bin/sh

# Establece la ruta donde Nginx sirve los archivos
ROOT_DIR=/usr/share/nginx/html

# Reemplaza el marcador de posición con el valor de la variable de entorno API_URL
echo "Replacing API_URL placeholder with: ${API_URL}"
# Itera sobre los archivos JS principales para encontrar y reemplazar el marcador
for file in $ROOT_DIR/main*.js;
do
  sed -i 's|__API_URL__|'${API_URL}'|g' $file
done

# Inicia el servidor Nginx en primer plano
nginx -g 'daemon off;'