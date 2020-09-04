import { Router } from 'express';
import { container } from 'tsyringe';

import UsersController from '../controllers/UsersController';
import { celebrate, Segments, Joi } from 'celebrate';
import UserAvatarController from '../controllers/UserAvatarController';

import ensureAuthenticated from  '@modules/users/infra/http/middlewares/ensureAuthenticated';

import multer from 'multer';
import uploadConfig from '@config/Upload';


const usersRouter = Router();
const upload = multer(uploadConfig);
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.post('/', celebrate({
  [Segments.BODY]: {
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }
}), usersController.create);

usersRouter.patch('/avatar', ensureAuthenticated, upload.single('avatar'),userAvatarController.update);

export default usersRouter;
