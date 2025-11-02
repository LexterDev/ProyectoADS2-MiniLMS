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
RUN npm run build

# ---- Etapa de Producción ----
FROM nginx:1.25-alpine AS production
COPY --from=builder /app/dist/edubyte-frontend/browser /usr/share/nginx/html

# Copia el archivo directamente a la configuración final, saltándose las plantillas.
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]