import { injectable, inject } from 'tsyringe';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import User from '@modules/users/infra/typeorm/entities/User';
import ICacheProvider from '@shared/container/provider/CacheProvider/models/ICacheProvider';
import { classToClass } from 'class-transformer';


interface Request {
  user_id: string;
}

@injectable()
  class ListProfileService {

  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('CacheProvider')
    private cacheProvider: ICacheProvider,
  ) {};

  public async execute({ user_id }: Request): Promise<User[]> {

    let users = await this.cacheProvider.recover<User[]>(`providers-list:${user_id}`);

    if (!users) {
      users = await this.usersRepository.findAllProvider({
        except_user_id: user_id,
      });
      await this.cacheProvider.save(`providers-list:${user_id}`, classToClass(users));
    }

   return users;
  }
}

export default ListProfileService;
