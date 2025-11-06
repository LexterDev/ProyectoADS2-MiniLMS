# ---- Etapa Base ----
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# ---- Etapa de Desarrollo ----
FROM base AS development
RUN npm install
COPY . .
EXPOSE 4200
CMD ["npm", "start"]

# ---- Etapa de Compilación ----
FROM base AS builder
RUN npm install
COPY . .
# Aseguramos que se use la configuración de producción para que tome environment.prod.ts
RUN npm run build -- --configuration production

# ---- Etapa de Producción ----
FROM nginx:1.25-alpine AS production
COPY --from=builder /app/dist/edubyte-frontend/browser /usr/share/nginx/html

# Copia la configuración de Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia el script de entrada y dale permisos de ejecución
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

EXPOSE 80

# Establece el script como el punto de entrada del contenedor.
# Este script se encargará de iniciar Nginx al final.
ENTRYPOINT ["/entrypoint.sh"]