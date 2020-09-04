import FakesUsersRepository from '../repositories/Fakes/FakesUsersRepository';
import SendForgotPasswordEmailService from './SendForgotPasswordEmailService';
import FakeMailProvider from '@shared/container/provider/MailProvider/fakes/FakeMailProvider';
import AppError from '@shared/errors/AppError';
import FakesUsersTokenRepository from '../repositories/Fakes/FakesUsersTokenRepository';

let fakesUsersRepository : FakesUsersRepository;
let fakeMailProvider: FakeMailProvider;
let fakesUsersTokenRepository: FakesUsersTokenRepository;
let sendForgotPasswordEmail: SendForgotPasswordEmailService;

describe('SendForgotPasswordEmail', () => {

  beforeEach(() => {
    fakesUsersRepository = new FakesUsersRepository();
    fakeMailProvider = new FakeMailProvider();
    fakesUsersTokenRepository = new FakesUsersTokenRepository();

    sendForgotPasswordEmail = new SendForgotPasswordEmailService(
      fakesUsersRepository,
      fakeMailProvider,
      fakesUsersTokenRepository,
    );
  });

  it('Should be able to recover the password using the email', async () => {
    const sendMail = jest.spyOn(fakeMailProvider, 'sendMail');
    await fakesUsersRepository.create({
      name: 'Jonh Doe',
      email: 'johndoe@exemplo.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'johndoe@exemplo.com',
    });

    expect(sendMail).toHaveBeenCalled();
  });

  it('Should not be able to recover a non-existing user passoword', async () => {
    await expect(
      sendForgotPasswordEmail.execute({
        email: 'johndoe@gmail.com',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('Should generate a forgot password token', async () => {
    const generateToken = jest.spyOn(fakesUsersTokenRepository, 'generate');
    const user = await fakesUsersRepository.create({
      name: 'Jonh Doe',
      email: 'johndoe@exemplo.com',
      password: '123456',
    });

    await sendForgotPasswordEmail.execute({
      email: 'johndoe@exemplo.com',
    });

    expect(generateToken).toHaveBeenCalledWith(user.id);
  });

});
