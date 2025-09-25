const { UserModel } = require('../models');
const {
  APIError,
  BadRequestError,
  STATUS_CODES,
} = require('../../utils/appErrors');

class UserRepository {
  async createUserRepository({ name, email, password, salt }) {
    try {
      const user = new UserModel({
        name,
        email,
        password,
        salt,
      });
      const userResult = await user.save();
      return userResult;
    } catch (error) {
      throw new APIError(
        'API Error',
        STATUS_CODES.INTERNAL_ERROR,
        'Unable to create user'
      );
    }
  }

  async findUserByEmailRepository(email) {
    try {
      const user = await UserModel.findOne({
        email,
      });
      return user;
    } catch (error) {
      throw new APIError(
        'API Error',
        STATUS_CODES.INTERNAL_ERROR,
        'Unable to Find User'
      );
    }
  }

  async findUserByIdRepository(userId) {
    try {
      const user = await UserModel.findById(userId);
      return user;
    } catch (error) {
      throw new APIError(
        'API Error',
        STATUS_CODES.INTERNAL_ERROR,
        'Unable to Find User'
      );
    }
  }

  async updateUserRepository(userId, updateData) {
    try {
      const updatedUser = await UserModel.findByIdAndUpdate(
        userId,
        updateData,
        { new: true }
      );
      return updatedUser;
    } catch (error) {
      throw new APIError(
        'API Error',
        STATUS_CODES.INTERNAL_ERROR,
        'Unable to Update User'
      );
    }
  }
}

module.exports = UserRepository;
