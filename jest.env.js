// api/jest.env.js

// Define o segredo do app para os testes.
// Este arquivo é carregado pelo Jest ANTES de qualquer outro código da aplicação ou de setup,
// garantindo que a variável de ambiente esteja disponível quando o 'config/index.js' for importado.
process.env.APP_SECRET = 'a_secret_for_testing_only';
