import FakesUsersRepository from '../repositories/Fakes/FakesUsersRepository';
import FakesUsersTokenRepository from '../repositories/Fakes/FakesUsersTokenRepository';
import FakesHashProvider from '../providers/HashProvider/fakes/FakesHashProvider';
import AppError from '@shared/errors/AppError';
import ResetPasswordService from './ResetPasswordService';

let fakesUsersRepository : FakesUsersRepository;
let fakesUsersTokenRepository: FakesUsersTokenRepository;
let fakesHashProvider: FakesHashProvider;
let resetPassword: ResetPasswordService;

describe('ResetPasswordService', () => {

  beforeEach(() => {
    fakesUsersRepository = new FakesUsersRepository();
    fakesUsersTokenRepository = new FakesUsersTokenRepository();
    fakesHashProvider = new FakesHashProvider();

    resetPassword = new ResetPasswordService(
      fakesUsersRepository,
      fakesUsersTokenRepository,
      fakesHashProvider
    );
  });

  it('Should be able to reset the password', async () => {
    const user = await fakesUsersRepository.create({
      name: 'Jonh Doe',
      email: 'johndoe@exemplo.com',
      password: '123456',
    });

    const { token } = await fakesUsersTokenRepository.generate(user.id);

    const generateHash = jest.spyOn(fakesHashProvider, 'generateHash');

    await resetPassword.execute({
      password: '123123',
      token,
    });

    const updateUser = await fakesUsersRepository.findById(user.id);

    expect(generateHash).toHaveBeenCalledWith('123123');
    expect(updateUser?.password).toBe('123123');
  });

  it('Should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPassword.execute({
        token: 'non-existing-token',
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to reset the password with non-existing user', async () => {
    const { token } = await fakesUsersTokenRepository.generate('non-existing-user');
    await expect(
      resetPassword.execute({
        token,
        password: '123456'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to reset password if passed more than 2 hours', async () => {
    const user = await fakesUsersRepository.create({
      name: 'Jonh Doe',
      email: 'johndoe@exemplo.com',
      password: '123456',
    });

    const { token } = await fakesUsersTokenRepository.generate(user.id);

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      const customDate = new Date();
      return customDate.setHours(customDate.getHours() + 3);
    });

    await expect(
      resetPassword.execute({
        password: '123123',
        token,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

});
