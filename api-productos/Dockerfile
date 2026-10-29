
# Usamos una versión estable de Node.js
FROM node:22-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiamos primero las dependencias
COPY package*.json ./

# Instalamos las dependencias del backend
RUN npm install

# Copiamos el código de la API
COPY . .

# Puerto que utiliza Express
EXPOSE 3000

# Iniciamos la API
CMD ["node", "--watch", "src/index.js"]
