
import { injectable, inject } from 'tsyringe';
import path from 'path';
import IMailProvider from '@shared/container/provider/MailProvider/models/IMailProvider';

import IUsersRepository from '../repositories/IUsersRepository'
import IUsersTokenRepository from '../repositories/IUsersTokenRepository';
import AppError from '@shared/errors/AppError';
import usersRouter from '../infra/http/routes/users.routes';

interface IRequest {
  email: string;
}

@injectable()
class SendForgotPasswordEmailService{

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('MailProvider')
    private mailProvider: IMailProvider,
    @inject('UserTokenRepository')
    private userTokenRespository: IUsersTokenRepository
  ) {};

  public async execute({email}: IRequest): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User does not exists.');
    }

    const { token } = await this.userTokenRespository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(__dirname, '..', 'views', 'forgot_password.hbs');

    await this.mailProvider.sendMail({
      to: {
        name: user.name,
        email: user.email
      },
      subject: '[GoBarber] Recuperação de senha',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.name,
          link: `${process.env.APP_WEB_URL}/reset-password?token=${token}`
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
