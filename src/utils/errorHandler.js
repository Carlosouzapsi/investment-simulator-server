// Importa a biblioteca 'winston', uma ferramenta popular para logging em Node.js.
const winston = require("winston");
// Importa a classe AppError para poder verificar se um erro é "confiável".
const { AppError } = require("./appErrors");

// Cria uma instância do logger do Winston.
const LogErrors = winston.createLogger({
  // Configura os "transportes", que são os destinos para onde os logs serão enviados.
  transports: [
    new winston.transports.Console(), // Envia os logs para o console.
    new winston.transports.File({ filename: "app_error.log" }), // Salva os logs em um arquivo.
  ],
});

// Esta classe parece ser uma versão duplicada ou antiga da ErrorLogger abaixo.
// A funcionalidade é idêntica. Em uma refatoração, ela poderia ser removida.
class ErrorHandler {
  constructor() {}

  async logError(err) {
    console.log("==================== Start Error Logger ===============");
    LogErrors.log({
      private: true,
      level: "error",
      message: `${new Date()}-${JSON.stringify(err)}`,
    });
    console.log("==================== End Error Logger ===============");
    return false;
  }

  isTrustError(error) {
    if (error instanceof AppError) {
      return error.isOperational;
    } else {
      return false;
    }
  }
}

// Esta classe encapsula a lógica de logging e de identificação de erros.
class ErrorLogger {
  constructor() {}
  // Método para registrar um erro.
  async logError(err) {
    console.log("==================== Start Error Logger ===============");
    // Usa a instância do Winston para registrar o erro.
    LogErrors.log({
      private: true, // Metadado personalizado.
      level: "error", // Nível do log.
      message: `${new Date()}-${JSON.stringify(err)}`, // Formata a mensagem de log.
    });
    console.log("==================== End Error Logger ===============");
    return false;
  }

  // Método crucial para determinar o tipo de erro.
  isTrustError(error) {
    // Verifica se o erro é uma instância da nossa classe AppError.
    if (error instanceof AppError) {
      // Se for, retorna a propriedade 'isOperational' que definimos.
      // Isso diferencia um erro esperado (ex: "Produto não encontrado") de um bug.
      return error.isOperational;
    } else {
      // Se não for uma instância de AppError, é um erro inesperado (ex: "undefined is not a function").
      // Portanto, não é um erro "confiável" ou operacional.
      return false;
    }
  }
}

// Este é o middleware de tratamento de erros do Express.
// Ele tem 4 argumentos (err, req, res, next), o que o diferencia de um middleware comum.
const errorHandlerMiddleware = async (err, req, res, next) => {
  // Cria uma instância do nosso logger.
  const errorLogger = new ErrorLogger();

  // ATENÇÃO: Registrar múltiplos listeners para o mesmo evento ('uncaughtException') como feito aqui é problemático.
  // O segundo listener sobrescreverá o primeiro. O ideal é ter apenas um listener para este evento.
  process.on("uncaughtException", (reason, promise) => {
    console.log(reason, "UNHANDLED");
    throw reason; // Re-lançar a exceção geralmente faz o processo travar. A melhor prática é logar e sair.
  });

  process.on("uncaughtException", (error) => {
    errorLogger.logError(error);
    // A lógica aqui sugere que se o erro não for confiável, o processo deveria ser reiniciado.
    if (!errorLogger.isTrustError(error)) {
      // process.exit(1); // Uma ação comum aqui seria encerrar o processo para evitar estado inconsistente.
    }
  });

  // A lógica principal do middleware começa aqui.
  // Verifica se um objeto de erro foi passado.
  if (err) {
    // Primeiro, registra o erro usando o logger.
    await errorLogger.logError(err);

    // Verifica se é um erro operacional (confiável).
    if (errorLogger.isTrustError(err)) {
      // Se for um erro operacional, envia uma resposta controlada para o cliente.
      if (err.errorStack) {
        // Se o erro tiver uma pilha de erros específica (como em um erro de validação), envia essa pilha.
        const errorDescription = err.errorStack;
        return res.status(err.statusCode).json({ message: errorDescription });
      }
      // Caso contrário, envia apenas a mensagem principal do erro.
      return res.status(err.statusCode).json({ message: err.message });
    } else {
      // Se NÃO for um erro confiável (é um bug inesperado), a lógica ideal seria
      // não vazar detalhes do erro para o cliente e talvez encerrar o processo.
    }
    // Este retorno de fallback pode vazar detalhes de erros não operacionais para o cliente.
    // Em produção, seria mais seguro retornar uma mensagem genérica.
    return res.status(err.statusCode || 500).json({ message: err.message });
  }
  // Se não houver erro, passa para o próximo middleware.
  next();
};

// Exporta o middleware para ser usado no arquivo principal da aplicação Express (ex: app.js).
module.exports = errorHandlerMiddleware;
