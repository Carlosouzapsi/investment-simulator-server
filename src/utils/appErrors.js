// Define um objeto com constantes para os códigos de status HTTP mais comuns.
// Isso evita o uso de "números mágicos" no código, tornando-o mais legível e fácil de manter.
const STATUS_CODES = {
  OK: 200,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

// A classe base para todos os erros personalizados da sua aplicação.
// Ela herda da classe 'Error' nativa do JavaScript.
class AppError extends Error {
  constructor(
    name, // O nome do erro (ex: 'APIError', 'ValidationError').
    statusCode, // O código de status HTTP que deve ser retornado ao cliente (ex: 404, 500).
    description, // A mensagem de erro detalhada para o cliente ou para logs.
    isOperational, // Um booleano que indica se o erro é "operacional" (esperado) ou um bug inesperado.
    errorStack, // Opcional: para passar uma pilha de erros mais detalhada.
    logingErrorResponse // Opcional: para passar uma resposta de erro específica para o log.
  ) {
    // Chama o construtor da classe 'Error' pai, passando a descrição.
    super(description);
    // Restaura a cadeia de protótipos, uma prática recomendada ao estender classes nativas como Error.
    Object.setPrototypeOf(this, new.target.prototype);
    // Define as propriedades personalizadas do erro.
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational; // Muito importante para o ErrorHandler saber como tratar o erro.
    this.errorStack = errorStack;
    this.logError = logingErrorResponse;
    // Captura a pilha de chamadas (stack trace) para este erro, ajudando na depuração.
    // A função captureStackTrace é um recurso específico do motor V8 do Node.js para otimizar os stack traces.
    // No entanto, ela não existe em todos os ambientes de execução JavaScript (como o ambiente de teste do Jest, em certas configurações).
    // Este 'if' garante que a função só seja chamada se existir, tornando o código mais robusto e evitando que os testes quebrem por problemas de ambiente.
    // Em produção (Node.js), esta condição será verdadeira. Nos testes, ela pode ser falsa, e tudo bem.
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

// Uma classe de erro genérica para erros relacionados à API.
// Ela herda de AppError e já define alguns valores padrão.
class APIError extends AppError {
  constructor(
    name,
    statusCode = STATUS_CODES.INTERNAL_ERROR, // Por padrão, um erro de API é um erro interno 500.
    description = 'Internal Server Error',
    isOperational = true // Assume que a maioria dos erros de API são operacionais (ex: falha na validação).
  ) {
    // Chama o construtor da classe pai (AppError) com os valores definidos.
    super(name, statusCode, description, isOperational);
  }
}

// Uma classe específica para erros de "Bad Request" (400).
// Usada quando a requisição do cliente está malformada ou faltam dados.
class BadRequestError extends AppError {
  constructor(description = 'Bad request', logingErrorResponse) {
    // Chama o construtor da classe base (AppError) com valores fixos para um erro 400.
    super(
      'NOT FOUND', // O nome aqui parece incorreto, deveria ser algo como "BAD REQUEST".
      STATUS_CODES.BAD_REQUEST,
      description,
      true, // É um erro operacional.
      false, // Não há uma pilha de erros específica.
      logingErrorResponse
    );
  }
}

// Uma classe específica para erros de validação (também um erro 400).
// Usada quando os dados enviados pelo cliente falham nas regras de validação (ex: e-mail inválido).
class ValidationError extends AppError {
  constructor(description = 'Validation Error', errorStack) {
    // Chama o construtor da classe base com valores para um erro de validação.
    super(
      'BAD REQUEST',
      STATUS_CODES.BAD_REQUEST,
      description,
      true, // É um erro operacional.
      errorStack // Passa a pilha de erros de validação, se houver.
    );
  }
}

// Exporta as classes e constantes para que possam ser usadas em outras partes da aplicação.
module.exports = {
  AppError,
  APIError,
  BadRequestError,
  ValidationError,
  STATUS_CODES,
};
