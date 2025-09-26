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

      const token = await generateSignature({
        email: email,
        _id: newUser._id,
      });
      return FormateData({ id: newUser._id, token });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = UserService;
