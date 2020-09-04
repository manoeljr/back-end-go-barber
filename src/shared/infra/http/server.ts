import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import { errors } from 'celebrate';
import AppError from '@shared/errors/AppError';
import rateLimiter from './middlewares/rateLimiter';
import 'express-async-errors';
import routes from './routes';
import cors from 'cors';
import '@shared/container';
import '@shared/infra/typeorm';
import uploadConfig from '@config/Upload';

const app = express();

app.use(rateLimiter);

app.use(cors());

app.use(express.json());

app.use('/files', express.static(uploadConfig.uploadsFolder));

app.use(routes);

app.use(errors());

// MiddleWare de erros
app.use((err: Error, request: Request, response: Response, next: NextFunction) => {
  if(err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: 'error',
      message: err.message,
    });
  }
  return response.status(500).json({
    status: 'error',
    message: 'Internal server error !',
  });
});

app.listen(3333, () => {
    console.log('Servidor em uso, Rodando');
});

