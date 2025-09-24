const UserModel = require('../../database/models/User');
const UserRepository = require('../../database/repository/UserRepository');

const userRepository = new UserRepository();

test('Should create a new user', async () => {
  const userData = {
    name: 'test new user',
    email: 'user@email.com',
    password: '123456',
  };

  const createdUser = await userRepository.createUserRepository(userData);

  expect(createdUser).not.toBeNull();
  expect(createdUser._id).toBeDefined();
  expect(createdUser.name).toBe(userData.name);
  expect(createdUser.email).toBe(userData.email);
});

test('Should not create an user with duplicated email', async () => {
  const userData = {
    name: 'test user email',
    email: 'duplicate@email.com',
    password: '123456',
  };

  const duplicatedUserData = {
    name: 'test user email',
    email: 'duplicate@email.com',
    password: '123456',
  };
  // create a first user
  await UserModel.create(userData);
  // user creation with duplicated email
  // Para testar se uma promessa é rejeitada, a estrutura correta é:
  // await expect(promessa).rejects.toThrow();
  await expect(
    userRepository.createUserRepository(duplicatedUserData)
  ).rejects.toThrow();
});

test('Should find an user by email', async () => {
  const userData = {
    name: 'test user email',
    email: 'email.test@email.com',
    password: '123456',
  };
  const foundUser = await userRepository.findUserByEmailRepository(
    userData.email
  );
  // Usando o model diretamente para popular o banco de teste
  await UserModel.create(userData);

  expect(foundUser).not.toBeNull();
  expect(foundUser.name).toBe(userData.name);
  expect(foundUser.email).toBe(userData.email);
});

test('Should find an user by Id', async () => {
  const userData = {
    name: 'IDtest',
    email: 'idtest@email.com',
    password: '123456',
  };

  // Preparação: Cria um usuário para ter um ID para buscar
  const user = await UserModel.create(userData);

  const foundUser = await userRepository.findUserByIdRepository(user._id);

  expect(foundUser).not.toBeNull();
  expect(foundUser.id).toBe(user.id);
  expect(foundUser.email).toBe(userData.email);
});

test('Should update an user name', async () => {
  const userData = {
    name: 'oldName',
    email: 'nameupdate@email.com',
    password: '123456',
  };

  // cria o usuário direto no banco
  const user = await UserModel.create(userData);
  // faz o update do nome do usuário
  const newName = 'updatedName';
  const updatedUser = await userRepository.updateUserRepository(user._id, {
    name: newName, // overrides old name
  });
  // encontra o usuário no banco
  const foundUpdatedUser = await User.findById(updatedUser._id);

  expect(foundUpdatedUser.name).toBe('Updated Name');
});
