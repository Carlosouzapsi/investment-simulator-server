const UserService = require('../services/UserService');
const UserAuth = require('./middlewares/auths');

module.exports = (app) => {
  const service = new UserService();

  app.post('/user/signup', async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      const { data } = await service.signUp({ name, email, password });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
};
