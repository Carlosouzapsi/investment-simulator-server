const { UserRepository } = require('../database');
const {
  FormateData,
  GeneratePassword,
  GenerateSalt,
  GenerateSignature,
  ValidatePassword,
  generateSignature,
} = require('../utils');
const { APIError, BadRequestError } = require('../utils/app-errors');

// All Business logic will be here
class UserService {
  constructor() {
    this.repository = new UserRepository();
  }
  async signUp(userInputs) {
    const { name, email, password } = userInputs;

    try {
      let salt = await GenerateSalt();

      let userPassword = await GeneratePassword(password, salt);

      const existentUser = await this.repository.findUserByEmailRepository({
        name,
        email,
        password: userPassword,
        salt,
      });
      const token = await generateSignature({
        email: email,
        _id: existentUser._id,
      });
      return FormateData({ id: existentUser._id, token });
    } catch (error) {
      throw new APIError('Data not found');
    }
  }
}

module.exports = UserService;
