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
module.exports.validatePassword = async (
  enteredPassword,
  savedPassword,
  salt
) => {
  return (await this.GeneratePassword(enteredPassword, salt)) === savedPassword;
};

// Gera uma assinatura JWT (JSON Web Token)
module.exports.generateSignature = async (payload) => {
  try {
    return await jwt.sign(payload, APP_SECRET, { expiresIn: '30d' });
  } catch (error) {
    console.error(error);
    return error;
  }
};

// Valida a assinatura JWT de uma requisição
module.exports.ValidateSignature = async (req) => {
  try {
    const signature = req.get('Authorization');
    console.log(signature);
    const payload = await jwt.verify(signature.split(' ')[1], APP_SECRET);
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
