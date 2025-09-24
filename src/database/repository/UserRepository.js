const { UserModel } = require("../models");
const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require("../../utils/appErrors");

class UserRepository {
  async createUserRepository({ name, email, password }) {
    try {
      const user = new UserModel({
        name,
        email,
        password,
      });
      const userResult = await user.save();
      return userResult;
    } catch (error) {
      throw new APIError(
        "API Error",
        STATUS_CODES.INTERNAL_ERROR,
        "Unable to create user"
      );
    }
  }

  async findUserByEmailRepository() {}

  async findUserByIdRepository() {}

  async updateUserRepository() {}
}

module.exports = UserRepository;
