const UserService = require('../services/UserService');
const UserAuth = require('./middlewares/auth');

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

  app.post('/user/signin', async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const { data } = await service.signIn({ email, password });
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });

  app.get('/user/profile', UserAuth, async (req, res, next) => {
    // Middle adicionado aqui!
    try {
      // 1. O middleware 'UserAuth' já validou o token e adicionou
      //    as informações do usuário (geralmente o ID) ao objeto 'req.user'.
      //    Agora, podemos pegar o ID do usuário diretamente de 'req.user'.
      const { _id } = req.user;
      // 2. Chamamos o método de serviço para buscar o perfil.
      const { data } = await service.getUserProfile(_id);
      return res.json(data);
    } catch (error) {
      next(error);
    }
  });
};
