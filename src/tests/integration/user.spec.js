const request = require('supertest');
const express = require('express');
const configureApp = require('../../express-app');
const { user } = require('../../api');
// Antes de cada teste, cria uma nova instância do app

describe('User API - Integration Tests', () => {
  let app;
  // Antes de cada teste, cria e configura uma nova instância do app
  beforeEach(async () => {
    app = express(); // Cria a instância do Express
    await configureApp(app); // Passa o app para a função de configuração
    user(app); // Conecta as rotas ao app
  });
  it('Should create a new user', async () => {
    // Dados de exemplo para o novo usuário:
    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };
    // Ação: Fazer a requisição para a rota de cadastro usando a aplicação importada:
    const response = await request(app).post('/user/signup').send(newUser);

    // A expectativa de status 201 provavelmente falhará agora,
    // mas o erro será um 500 (Internal Server Error) devido à lógica incorreta no UserService,
    // e não mais um 404 (Not Found) ou um body nulo.
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id');
    expect(response.body).toHaveProperty('token');
  });

  it('Should not create a new user with email duplicated', async () => {
    const userData = {
      name: 'Existing User',
      email: 'duplicate@example.com',
      password: 'password123',
    };
    // Faz a primeira requisição para garantir que o usuário exista no banco de dados.
    // Esperamos que esta primeira chamada seja bem-sucedida (status 200)
    await request(app).post('/user/signup').send(userData).expect(200);

    // --- 2. Agir (Act) ---
    // Agora, tentamos cadastrar um novo usuário com o MESMO e-mail.
    // Podemos até mudar o nome e a senha para provar que a validação é só no e-mail.
    const duplicateUserData = {
      name: 'Another User',
      email: 'duplicate@example.com', // E-mail repetido.
      password: 'anotherpassword',
    };

    // Fazemos a segunda requisição, que é o alvo real do nosso teste.
    const response = await request(app)
      .post('/user/signup')
      .send(duplicateUserData);

    // --- 3. Verificar (Assert) ---
    // Esperamos que o servidor rejeite a requisição com um status de conflito.
    expect(response.status).toBe(409); // 409 Conflict é o status HTTP ideal para este caso.

    // Também verificamos se o corpo da resposta contém uma mensagem de erro
    // clara e informativa, indicando o motivo da falha.
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('This email is already in use.'); // Verificamos parte da mensagem.
  });
});
