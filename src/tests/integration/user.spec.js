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
});
