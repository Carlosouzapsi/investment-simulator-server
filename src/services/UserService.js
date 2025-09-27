const { UserRepository } = require('../database');
const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
  generateSignature,
} = require('../utils');
const { APIError, BadRequestError } = require('../utils/appErrors');

// All Business logic will be here
class UserService {
  constructor() {
    this.repository = new UserRepository();
  }
  async signUp(userInputs) {
    const { name, email, password } = userInputs;

    try {
      // REGRA DE NEGÓCIO EMAIL VERIFICAR EMAIL DUPLICADO
      const existingUser =
        await this.repository.findUserByEmailRepository(email);
      // Se o email já existem deve disparar o erro abaixo.
      if (existingUser) {
        throw new BadRequestError('This email is already in use.');
      }

      let salt = await GenerateSalt();

      let userPassword = await GeneratePassword(password, salt);

      const newUser = await this.repository.createUserRepository({
        name,
        email,
        password: userPassword,
        salt,
      });

      const token = await GenerateSignature({
        email: email,
        _id: newUser._id,
      });
      return FormateData({ id: newUser._id, token });
    } catch (error) {
      throw error;
    }
  }

  async signIn(userInputs) {
    const { email, password } = userInputs;

    try {
      const existingUser =
        await this.repository.findUserByEmailRepository(email);

      if (!existingUser) {
        throw new BadRequestError('Invalid credentials');
      }
      const validPassword = await ValidatePassword(
        password,
        existingUser.password,
        existingUser.salt
      );

      if (!validPassword) {
        throw new BadRequestError('Invalid credentials.');
      }

      const token = await GenerateSignature({
        email: existingUser.email,
        _id: existingUser._id,
      });

      return FormateData({
        id: existingUser._id,
        token,
      });
    } catch (error) {
      throw error;
    }
  }

  async getUserProfile(userId) {
    try {
      // 1. Delega a busca do usuário pelo ID para a camada de repositório.
      const existingUser = await this.repository.findUserByIdRepository(userId);
      // 2. Se o usuário não for encontrado (o que seria raro para um usuário autenticado, mas é uma boa verificação),
      // lança um erro.
      if (!existingUser) {
        throw new BadRequestError('User not found.');
      }
      // 3. Retorna os dados do usuário formatados.
      // É crucial NUNCA retornar a senha (password) ou o salt.
      return FormateData(existingUser);
    } catch (error) {
      // Relança o erro para o handler global.
      throw error;
    }
  }
}

module.exports = UserService;
