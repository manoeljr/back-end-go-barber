import FakesUsersRepository from '../repositories/Fakes/FakesUsersRepository';
import FakesHashProvider from '../providers/HashProvider/fakes/FakesHashProvider';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';
import AppError from '@shared/errors/AppError';

let fakesUsersRepository: FakesUsersRepository;
let fakesHashProvider: FakesHashProvider;
let createUser: CreateUserService;
let authenticateUser: AuthenticateUserService;

describe('AuthenticateUser', () => {

  beforeEach(() => {
    fakesUsersRepository = new FakesUsersRepository();
    fakesHashProvider = new FakesHashProvider();
    authenticateUser = new AuthenticateUserService(fakesUsersRepository, fakesHashProvider);
  });

  it('Should be able to authenticate', async () => {
    const newUser = await fakesUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    });

    const response = await authenticateUser.execute({
      email: 'johndoe@gmail.com',
      password: '123456'
    });

    await expect(response).toHaveProperty('token');
    await expect(response.user).toEqual(newUser);
  });

  it('Should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUser.execute({
        email: 'johndoe@gmail.com',
        password: '123456',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to authenticate with wrong password', async () => {
    await fakesUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    });

    await expect(
      authenticateUser.execute({
        email: 'johndoe@gmail.com',
        password: 'wrong-password'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

});
