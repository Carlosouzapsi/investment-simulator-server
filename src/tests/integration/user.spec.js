const request = require('supertest');
const express = require('express');
const app = express();
describe('User API - Integration Tests', () => {
  it('Should create a new user', async () => {
    // Dados de exemplo para o novo usuário:
    const newUser = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    };
    // Ação: Fazer a requisição para a rota de cadastro:
    const response = await request(app).post('/user/signup').send(newUser);

    // expect(response.status).toBe(201);
    // expect(response.body).toHaveProperty('id');
    // expect(response.body).toHaveProperty('token');
    // expect(response.body.name).toBe(newUser.email);
  });
});
