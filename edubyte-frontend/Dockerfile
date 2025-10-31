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
CMD ["npm", "start"]

FROM base AS builder
RUN npm install
COPY . .
RUN npm run build

FROM nginx:1.25-alpine AS production
COPY --from=builder /app/dist/edubyte-frontend/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]