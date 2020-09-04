import User from '@modules/users/infra/typeorm/entities/User';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

import { injectable, inject } from 'tsyringe';

import authConfig from '@config/auth';

import IUsersRepository from '../repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';

import { sign } from 'jsonwebtoken';


interface Request {
  email: string;
  password: string;
}

@injectable()
class AuthenticateUserService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {};

  public async execute({ email, password }: Request): Promise<{ user: User, token: string}> {
    const user = await this.usersRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Incorrect email/passoword combination !', 401);
    }

    const passwordMatched = await this.hashProvider.compareHash(password, user.password);

    if (!passwordMatched) {
      throw new AppError('Incorrect email/passoword combination !', 401);
    }

    const { secret, expiresIn } = authConfig.jwt;
    //parametros na funcção sign({informações do usuario e permissões}, uma chave,
    //                           { subjet:id do usuario, expiresIn:quanto tempo o token vai durar}
    //                          )
    const token = sign({}, secret, {
      subject: user.id,
      expiresIn,
    });

    return {
      user,
      token,
    };

  }
}

export default AuthenticateUserService;
