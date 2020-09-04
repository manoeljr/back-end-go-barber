import FakesUsersRepository from '../repositories/Fakes/FakesUsersRepository';
import FakesHashProvider from '../providers/HashProvider/fakes/FakesHashProvider';
import FakeCacheProvider from '@shared/container/provider/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';

let fakesUsersRepository: FakesUsersRepository;
let fakesHashProvider: FakesHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUser: CreateUserService;

describe('CreateUser', () => {

  beforeEach(() => {
    fakesUsersRepository = new FakesUsersRepository();
    fakesHashProvider = new FakesHashProvider();
    createUser = new CreateUserService(fakesUsersRepository, fakesHashProvider, fakeCacheProvider);
  });

  it('Should be able to create a new User', async () => {
    const user = await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    });

    await expect(user).toHaveProperty('id');
  });

  it('Should not be able to create a new user with same email from another', async () => {
    await createUser.execute({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    });

    await expect(
      createUser.execute({
        name: 'John Doe',
        email: 'johndoe@gmail.com',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

});
