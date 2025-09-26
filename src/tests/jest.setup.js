// Importa o servidor MongoDB em memória e o Mongoose.
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Declara uma variável para manter a instância do servidor MongoDB.
let mongoServer;

// HOOK: EXECUTADO UMA VEZ ANTES DE TODOS OS TESTES
// Responsável por iniciar o servidor em memória e estabelecer a conexão principal.
beforeAll(async () => {
  // Cria uma nova instância do MongoMemoryServer.
  mongoServer = await MongoMemoryServer.create();
  // Obtém a URI de conexão do servidor em memória.
  const mongoUri = mongoServer.getUri();

  // Define a URI como uma variável de ambiente para a aplicação Express usar.
  process.env.MONGO_URI = mongoUri;

  // Conecta o Mongoose UMA VEZ no início de todos os testes.
  await mongoose.connect(mongoUri);
});

// HOOK: EXECUTADO UMA VEZ APÓS TODOS OS TESTES
// Finaliza a conexão e desliga o servidor do banco de dados em memória.
afterAll(async () => {
  // Desconecta o Mongoose.
  await mongoose.disconnect();
  // Para a instância do servidor MongoDB, liberando os recursos.
  await mongoServer.stop();
});

// HOOK: EXECUTADO ANTES DE CADA TESTE INDIVIDUAL
// Responsável por limpar o banco de dados para garantir que os testes sejam independentes.
beforeEach(async () => {
  // Obtém todas as coleções do banco de dados conectado.
  const collections = mongoose.connection.collections;
  // Itera sobre cada coleção e deleta todos os seus documentos.
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});
