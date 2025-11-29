FROM node:18-alpine

# Directorio de trabajo dentro del contenedor
WORKDIR /app

# Copiamos solo package.json y package-lock.json para aprovechar la caché de Docker
COPY package*.json ./

# Instalamos TODAS las dependencias (incluye nodemon para hot-reload)
RUN npm install

# Copiamos el resto del código
COPY . .

# Variables de entorno por defecto (modo desarrollo para hot reload)
ENV NODE_ENV=development
ENV PORT=8000

# Puerto que expone la app (debe coincidir con PORT en .env)
EXPOSE 8000

# Comando por defecto (se puede sobrescribir en docker-compose)
CMD ["npm", "start"]


