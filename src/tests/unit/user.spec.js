const UserModel = require('../../database/models/User');
const UserRepository = require('../../database/repository/UserRepository');
const { GenerateSalt } = require('../../utils');

const userRepository = new UserRepository();

test('Should create a new user', async () => {
  let salt = await GenerateSalt();
  const userData = {
    name: 'test new user',
    email: 'user@email.com',
    password: '123456',
    salt: salt,
  };
  // Criando um usuário com o método testado do repository
  const createdUser = await userRepository.createUserRepository(userData);

  expect(createdUser).not.toBeNull();
  expect(createdUser._id).toBeDefined();
  expect(createdUser.name).toBe(userData.name);
  expect(createdUser.email).toBe(userData.email);
});

test('Should find an user by email', async () => {
  let salt = await GenerateSalt();
  const userData = {
    name: 'testuseremail',
    email: 'email.test@email.com',
    password: '123456',
    salt: salt,
  };
  // Usando o model diretamente para popular o banco de teste
  await UserModel.create(userData);
  // Buscando um usuário que exista pelo email
  const foundUser = await userRepository.findUserByEmailRepository(
    userData.email
  );

  expect(foundUser).not.toBeNull();
  expect(foundUser.name).toBe(userData.name);
  expect(foundUser.email).toBe(userData.email);
});

test('Should find an user by Id', async () => {
  let salt = await GenerateSalt();
  const userData = {
    name: 'IDtest',
    email: 'idtest@email.com',
    password: '123456',
    salt: salt,
  };

  // Preparação: Cria um usuário para ter um ID para buscar
  const user = await UserModel.create(userData);

  const foundUser = await userRepository.findUserByIdRepository(user._id);

  expect(foundUser).not.toBeNull();
  expect(foundUser.id).toBe(user.id);
  expect(foundUser.email).toBe(userData.email);
});
