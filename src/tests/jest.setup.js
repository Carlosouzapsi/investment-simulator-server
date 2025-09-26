// Importa o servidor MongoDB em memória e o Mongoose.
const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');

// Declara uma variável para manter a instância do servidor MongoDB.
let mongoServer;

// HOOK: EXECUTADO UMA VEZ ANTES DE TODOS OS TESTES
// Responsável por iniciar o banco de dados em memória e preparar o ambiente.
beforeAll(async () => {
  // Cria uma nova instância do MongoMemoryServer.
  mongoServer = await MongoMemoryServer.create();
  // Obtém a URI de conexão do servidor em memória.
  const mongoUri = mongoServer.getUri();
  // Define a URI como uma variável de ambiente.
  // Isso é CRUCIAL para os testes de integração, pois permite que a aplicação
  // Express (carregada via 'supertest') se conecte ao banco de dados de teste.
  process.env.MONGO_URI = mongoUri;
  // A definição de APP_SECRET foi movida para jest.env.js para garantir a ordem de execução correta.
});

// HOOK: EXECUTADO ANTES DE CADA TESTE INDIVIDUAL
// Garante que há uma conexão ativa com o banco de dados antes de cada 'it()'.
beforeEach(async () => {
  // Conecta o Mongoose à URI do banco de dados em memória.
  // Isso é essencial para os testes de unidade que interagem diretamente com os models/repositories.
  await mongoose.connect(mongoServer.getUri());
});

// HOOK: EXECUTADO APÓS CADA TESTE INDIVIDUAL
// Responsável por limpar o banco de dados para garantir que os testes sejam independentes.
afterEach(async () => {
  // Obtém todas as coleções do banco de dados conectado.
  const collections = mongoose.connection.collections;
  // Itera sobre cada coleção e deleta todos os seus documentos.
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({}); // Limpa a coleção.
  }
  // Desconecta o Mongoose após a limpeza.
  await mongoose.disconnect();
});

// HOOK: EXECUTADO UMA VEZ APÓS TODOS OS TESTES
// Finaliza a conexão e desliga o servidor do banco de dados em memória.
afterAll(async () => {
  // Para a instância do servidor MongoDB, liberando os recursos.
  await mongoServer.stop();
});
