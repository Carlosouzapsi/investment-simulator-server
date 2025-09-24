const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

let mongoServer;

// Este hook é executado uma vez antes de todos os testes neste arquivo.
beforeAll(async () => {
  // Cria uma nova instância do servidor MongoDB em memória.
  mongoServer = await MongoMemoryServer.create();
  // Pega a URI de conexão do servidor em memória.
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  // Desconecta o Mongoose.
  await mongoose.disconnect();
  // Para a instância do servidor MongoDB em memória.
  await mongoServer.stop();
});
// Este hook é executado após cada teste.
afterEach(async () => {
  // Limpa todas as coleções do banco de dados.
  // Isso garante que cada teste comece com um banco de dados limpo.
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany();
  }
});
