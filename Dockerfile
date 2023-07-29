# Espeficamos version de node e imagen docker para nuestro entorno de desarrollo

FROM node:16.14.0 AS development

# Especificamos el directorio de trabajo

WORKDIR /realtime-api

# Copiamos los archivos necesarios
COPY package*.json ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./

# Corremos los comandos para la generacion de nuestro build
RUN npm ci
RUN npm run build

# Exponemos la API en el puerto 3044
EXPOSE 3044

# Espeficamos version de node e imagen docker para nuestro entorno de produccion
FROM node:16.14.0 AS production

# Establecemos nuestra variable de entorno en produccion
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

# Especificamos nuestro directorio de trabajo
WORKDIR /realtime-api

# Copiamos los mismos archivos de nuestro entorno de desarrollo
COPY --from=development /realtime-api .

# Exponemos el mismo puerto
EXPOSE 3044

# Especificamos el comando de arranque y la ubicacion del archivo main
CMD ["node", "dist/main"]

