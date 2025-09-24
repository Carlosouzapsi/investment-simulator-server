# Use a imagem oficial do Node.js 22
FROM node:22-slim

# Define o diretório de trabalho dentro do container
WORKDIR /usr/src/app

# Copia os arquivos package.json e package-lock.json
COPY package*.json ./

# Instala as dependências da aplicação
RUN npm install

# Copia o restante dos arquivos da aplicação
COPY . .

# Expõe a porta que a aplicação vai rodar
EXPOSE 3001

# Comando para iniciar a aplicação
CMD [ "npm", "start" ]