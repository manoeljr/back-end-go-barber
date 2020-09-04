import FakesUsersRepository from '@modules/users/repositories/Fakes/FakesUsersRepository';
import FakeCacheProvider from '@shared/container/provider/CacheProvider/fakes/FakeCacheProvider';
import ListProviderService from './ListProviderService';
import AppError from '@shared/errors/AppError';

let fakesUsersRepository: FakesUsersRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviders: ListProviderService;

describe('ListProvider', () => {

  beforeEach(() => {
    fakesUsersRepository = new FakesUsersRepository();
    listProviders = new ListProviderService(fakesUsersRepository, fakeCacheProvider);
  });

  it('Should be able to list the providers', async () => {
    const user1 = await fakesUsersRepository.create({
      name: 'John Doe',
      email: 'johndoe@gmail.com',
      password: '123456'
    });

    const user2 = await fakesUsersRepository.create({
      name: 'John Trê',
      email: 'johntre@gmail.com',
      password: '123456'
    });


    const loggerUser = await fakesUsersRepository.create({
      name: 'John Qua',
      email: 'johnqua@gmail.com',
      password: '123456'
    });


    const providers = await listProviders.execute({
      user_id: loggerUser.id
    });

    expect(providers).toEqual([
      user1,
      user2
    ]);
  });

});
