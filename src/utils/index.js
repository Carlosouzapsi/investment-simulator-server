const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { APP_SECRET } = require('../config');

// Gera um "sal" para ser usado na criptografia de senhas
module.exports.GenerateSalt = async () => {
  return await bcryptjs.genSalt();
};

// Gera uma senha criptografada usando bcryptjs
module.exports.GeneratePassword = async (password, salt) => {
  return await bcryptjs.hash(password, salt);
};

// Valida se a senha fornecida corresponde à senha salva no banco de dados
module.exports.ValidatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

// Gera uma assinatura JWT (JSON Web Token)
module.exports.GenerateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: '30d' });
  } catch (error) {
    // Lançar o erro garante que o fluxo seja interrompido
    // em vez de continuar com um token inválido (que é um objeto de erro).
    console.error('Error generating JWT signature:', error);
    throw error;
  }
};

// Valida a assinatura JWT de uma requisição
module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get('Authorization');
    if (!signature) {
      console.log('Authorization header is missing.');
      return false;
    }
    const token = signature.split(' ')[1];
    if (!token) {
      console.log('Token is missing or malformed in Authorization header');
      return false;
    }
    const payload = await jwt.verify(token, APP_SECRET);
    req.user = payload;
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
};

// Formata os dados para uma estrutura padronizada de resposta
module.exports.FormateData = (data) => {
  if (data) {
    return { data };
  } else {
    throw new Error('Data Not found!');
  }
};
