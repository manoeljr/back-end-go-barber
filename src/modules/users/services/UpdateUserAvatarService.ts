import User from '@modules/users/infra/typeorm/entities/User';
import path from 'path';

import { injectable, inject } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';

import AppError from '@shared/errors/AppError';

import uploadConfig from '@config/Upload';
import fs from 'fs';
import IStorageProvider from '@shared/container/provider/StorageProvider/models/IStorageProvider';


interface Request {
  user_id: string;
  avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {};

  public async execute({ user_id, avatarFileName}: Request): Promise<User> {
    const user = await this.usersRepository.findById(user_id);

    if (!user) {
      throw new AppError('Only authenticated users can change avatar.', 401);
    }

    if (user.avatar) {
      await this.storageProvider.deleteFile(avatarFileName);
    }

    const fileName = await this.storageProvider.saveFile(avatarFileName);

    user.avatar = fileName;

    await this.usersRepository.save(user);
    return user;
  }
}

export default UpdateUserAvatarService;
