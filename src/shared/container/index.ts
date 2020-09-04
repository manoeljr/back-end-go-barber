import { container} from 'tsyringe';

import './provider';

import '@modules/users/providers';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UserRepository from '@modules/users/infra/typeorm/repositories/UserRepository';

import IUsersTokenRepository from '@modules/users/repositories/IUsersTokenRepository';
import UsersTokenRepository from '@modules/users/infra/typeorm/repositories/UserTokenRepository';

import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';

container.registerSingleton<IAppointmentsRepository>('AppointmentsRepository', AppointmentsRepository);

container.registerSingleton<IUsersRepository>('UserRepository', UserRepository);

container.registerSingleton<IUsersTokenRepository>('UsersTokenRepository', UsersTokenRepository);

container.registerSingleton<INotificationsRepository>('NotificationsRepository', NotificationsRepository);
