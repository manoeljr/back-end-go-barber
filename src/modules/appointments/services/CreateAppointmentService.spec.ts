import FakeNotificationRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import FakesAppointmentsRepository from '../repositories/Fakes/FakesAppointmentsRepository';
import FakeCacheProvider from '@shared/container/provider/CacheProvider/fakes/FakeCacheProvider';
import CreateAppointmentService from './CreateAppointmentService';
import AppError from '@shared/errors/AppError';

let fakesAppointmentsRepository: FakesAppointmentsRepository;
let fakeNotificationRepository: FakeNotificationRepository;
let fakeCacheProvider: FakeCacheProvider;
let createAppointment: CreateAppointmentService;

describe('CreateAppointment', () => {

  beforeEach(() => {
    fakesAppointmentsRepository = new FakesAppointmentsRepository();
    fakeNotificationRepository = new FakeNotificationRepository();
    createAppointment = new CreateAppointmentService(fakesAppointmentsRepository, fakeNotificationRepository, fakeCacheProvider);
  });

  it('Should be able to create a new Appointment', async () => {

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    const appointment = await createAppointment.execute({
      date: new Date(2020, 4, 10, 13),
      user_id: 'user_id',
      provider_id: 'provider_id'
    });

    expect(appointment).toHaveProperty('id');
    expect(appointment.provider_id).toBe('provider_id');
  });

  it('Should not be able to create two appointments on the same time', async () => {
    const appointmentDate = new Date(2020, 4, 10, 11);

    await createAppointment.execute({
      date: appointmentDate,
      user_id: 'user_id',
      provider_id: 'provider_id'
    });

    await expect(
      createAppointment.execute({
        date: appointmentDate,
        user_id: 'user_id',
        provider_id: 'provider_id'
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should not be able to create an appointment on a past date', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 11),
        user_id: 'user_id',
        provider_id: 'provider_id',
      }),
    ).rejects.toBeInstanceOf(AppError);

  });

  it('Should not be able to create an appointment with same user as provider', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 13),
        user_id: 'user_id',
        provider_id: 'user_id',
      }),
    ).rejects.toBeInstanceOf(AppError);

  });

  it('Should not be able to create an appointment before 8am and after 5pm', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2020, 4, 10, 12).getTime();
    });

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 7),
        user_id: 'user_id',
        provider_id: 'provider_id',
      }),
    ).rejects.toBeInstanceOf(AppError);

    await expect(
      createAppointment.execute({
        date: new Date(2020, 4, 10, 18),
        user_id: 'user_id',
        provider_id: 'provider_id',
      }),
    ).rejects.toBeInstanceOf(AppError);

  });

});
