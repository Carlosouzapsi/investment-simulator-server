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
test('Should update an existing user', async () => {
  // --- 1. Preparar (Arrange) ---
  // Cria um usuário inicial diretamente no banco de dados de teste.
  const initialUserData = {
    name: 'Initial Name',
    email: 'update-repo@example.com',
    password: 'password123',
    salt: await GenerateSalt(),
  };
  const createdUser = await UserModel.create(initialUserData);

  // Define os novos dados que queremos aplicar.
  const updateData = { name: 'Updated Name From Repository Test' };

  // --- 2. Agir (Act) ---
  // Chama o método do repositório que queremos testar.
  const updatedUser = await userRepository.updateUserRepository(
    createdUser._id,
    updateData
  );

  // --- 3. Verificar (Assert) ---
  // Garante que o método retornou um usuário.
  expect(updatedUser).not.toBeNull();
  // Verifica se o nome no objeto retornado foi atualizado.
  expect(updatedUser.name).toBe(updateData.name);
  // Verifica se o e-mail (que não foi atualizado) permaneceu o mesmo.
  expect(updatedUser.email).toBe(initialUserData.email);

  // Verificação extra (opcional, mas recomendada):
  // Busca o usuário diretamente no banco para garantir que a alteração foi persistida.
  const userFromDb = await UserModel.findById(createdUser._id);
  expect(userFromDb.name).toBe(updateData.name);
});
