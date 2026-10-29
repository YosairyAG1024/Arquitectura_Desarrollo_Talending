
# Imagen de Node.js
FROM node:22-alpine

# Carpeta de trabajo
WORKDIR /app

# Copiamos los archivos de dependencias
COPY package*.json ./

# Instalamos las dependencias de React
RUN npm install

# Copiamos el código del frontend
COPY . .

# Puerto de desarrollo de Vite
EXPOSE 5173

# Permitimos acceder al servidor desde fuera del contenedor
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]
