import FakeAppointmentsRepository from '../repositories/Fakes/FakesAppointmentsRepository';
import FakeCacheProvider from '@shared/container/provider/CacheProvider/fakes/FakeCacheProvider';
import ListProviderAppointmentsService from './ListProviderAppointmentsService';


let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeCacheProvider: FakeCacheProvider;
let listProviderAppointments: ListProviderAppointmentsService;

describe('ListProviderAppointments', () => {

  beforeEach(() => {
    fakeAppointmentsRepository = new FakeAppointmentsRepository();
    listProviderAppointments = new ListProviderAppointmentsService(fakeAppointmentsRepository, fakeCacheProvider);
  });

  it('Should be able to list the appointments on a specific day', async () => {

    const appointmente1 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 20, 14, 0, 0),
    });

    const appointmente2 = await fakeAppointmentsRepository.create({
      provider_id: 'provider',
      user_id: 'user',
      date: new Date(2020, 4, 20, 15, 0, 0),
    });

    const appointments = await listProviderAppointments.execute({
      provider_id: 'provider',
      year: 2020,
      month: 5,
      day: 20,
    });

    expect(appointments).toEqual([ appointmente1, appointmente2 ]);

  });


});
