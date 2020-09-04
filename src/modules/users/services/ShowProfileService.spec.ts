import FakesUsersRepository from '../repositories/Fakes/FakesUsersRepository';
import ShowProfileService from './ShowProfileService';
import AppError from '@shared/errors/AppError';

let fakesUsersRepository: FakesUsersRepository;
let showProfile: ShowProfileService;

describe('UpdateProfile', () => {

  beforeEach(() => {
    fakesUsersRepository = new FakesUsersRepository();
    showProfile = new ShowProfileService(fakesUsersRepository);
  });

  it('Should be able to show the profile', async () => {
    const user = await fakesUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    });

    const profile = await showProfile.execute({
      user_id: user.id
    });

    expect(profile.name).toBe('John Doe');
    expect(profile.email).toBe('johndoe@gmail.com');
  });

  it('Should not be able to show the profile from non-existing user.', async () => {
    expect(showProfile.execute({
      user_id: 'non-existing-user-id'
    })).rejects.toBeInstanceOf(AppError);
  });

});
