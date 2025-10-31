# ---- Etapa Base ----
# Define la imagen base de Node y el directorio de trabajo.
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- Etapa de Desarrollo ----
# Instala dependencias y expone el puerto para 'ng serve'.
FROM base AS development
RUN npm install
COPY . .
EXPOSE 4200
CMD ["ng", "serve", "--host", "0.0.0.0"]

# ---- Etapa de Compilación (Build) ----
# Crea la compilación de producción de la aplicación.
FROM base AS builder
RUN npm install
COPY . .
# La bandera --configuration production es el valor por defecto para ng build
RUN npm run build

# ---- Etapa de Producción Final ----
# Utiliza Nginx para servir los archivos estáticos generados.
FROM nginx:1.25-alpine AS production
# Copia los artefactos de la aplicación desde la etapa 'builder'.
# La ruta de salida se define en angular.json (dist/edubyte-frontend/browser).
COPY --from=builder /app/dist/edubyte-frontend/browser /usr/share/nginx/html
# Copia la configuración personalizada de Nginx desde la raíz del proyecto.
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]