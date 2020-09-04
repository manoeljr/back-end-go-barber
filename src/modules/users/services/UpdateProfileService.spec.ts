import FakesUsersRepository from '../repositories/Fakes/FakesUsersRepository';
import FakesHashProvider from '../providers/HashProvider/fakes/FakesHashProvider';
import UpdateProfileService from './UpdateProfileService';
import AppError from '@shared/errors/AppError';

let fakesUsersRepository: FakesUsersRepository;
let fakesHashProvider: FakesHashProvider;
let updateProfile: UpdateProfileService;

describe('UpdateProfile', () => {

  beforeEach(() => {
    fakesUsersRepository = new FakesUsersRepository();
    fakesHashProvider = new FakesHashProvider();
    updateProfile = new UpdateProfileService(fakesUsersRepository, fakesHashProvider);
  });

  it('Should be able to update the profile', async () => {
    const user = await fakesUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@gmail.com'
    });

    expect(updateUser.name).toBe('John Trê');
    expect(updateUser.email).toBe('johntre@gmail.com');
  });

  it('Should not be able to update the profile from non-existing user.', async () => {
    expect(updateProfile.execute({
      user_id: 'non-existing-user-id',
      name: 'Test',
      email: 'test@gmail.com',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to change to another to user email', async () => {
    await fakesUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    });

    const user = await fakesUsersRepository.create({
      name: 'Test',
      email: 'test@gmail.com',
      password: '123456'
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Doe',
      email: 'johndoe@gmail.com'
    })).rejects.toBeInstanceOf(AppError);

  });

  it('Should be able to update the password', async () => {
    const user = await fakesUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    });

    const updateUser = await updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@gmail.com',
      old_password: '123456',
      password: '123123',
    });

    expect(updateUser.password).toBe('123123');
  });

  it('Should not be able to update the password without old password', async () => {
    const user = await fakesUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@gmail.com',
      password: '123123',
    })).rejects.toBeInstanceOf(AppError);
  });

  it('Should be able to update the password with wrong old password', async () => {
    const user = await fakesUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    });

    await expect(updateProfile.execute({
      user_id: user.id,
      name: 'John Trê',
      email: 'johntre@gmail.com',
      old_password: 'wrong-old-password',
      password: '123123',
    })).rejects.toBeInstanceOf(AppError);
  });

});
