import FakesUsersRepository from '../repositories/Fakes/FakesUsersRepository';
import FakesHashProvider from '../providers/HashProvider/fakes/FakesHashProvider';
import FakeStorageProvider from '@shared/container/provider/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from './UpdateUserAvatarService';
import AppError from '@shared/errors/AppError';

let fakesUsersRepository: FakesUsersRepository;
let fakeStorageProvider: FakeStorageProvider;
let updateUserAvatar: UpdateUserAvatarService;

describe('UploadUserAvatar', () => {

  beforeEach(() => {
    fakesUsersRepository = new FakesUsersRepository();
    fakeStorageProvider = new FakeStorageProvider();
    updateUserAvatar = new UpdateUserAvatarService(fakesUsersRepository, fakeStorageProvider);
  });

  it('Should be able to create a new User', async () => {
    const user = await fakesUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg'
    });

    expect(user.avatar).toBe('avatar.jpg');
  });

  it('Should be able to update avatar from no existing user', async () => {
    await expect(
      updateUserAvatar.execute({
        user_id: 'no-existing-user',
        avatarFileName: 'avatar.jpg'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should delete old avatar when updating new one', async () => {
    const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');
    const user = await fakesUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar.jpg'
    });

    await updateUserAvatar.execute({
      user_id: user.id,
      avatarFileName: 'avatar2.jpg'
    });

    expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');
    expect(user.avatar).toBe('avatar.jpg');
  });

});
