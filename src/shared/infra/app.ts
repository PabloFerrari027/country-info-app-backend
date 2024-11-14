import 'reflect-metadata';
import express from 'express';
import Cors from 'cors';
import { container } from 'tsyringe';
import { env } from 'process';
import { ResponseTimeListener } from './https/middlewares/response-time-listener';
import { CustomExpressResponse } from './https/middlewares/custom-express-response';
import { routes } from './https/routes';
import { MakeAllRepositories } from '@shared/factories/make-all-repositories';
import { MakeAllServices } from '@shared/factories/make-all-services';

MakeAllRepositories.execute({ type: 'PRODUCTION' });
MakeAllServices.execute();

export const app = express();

const responseTimeListener = container.resolve(ResponseTimeListener);
const customExpressResponse = container.resolve(CustomExpressResponse);

const cors = Cors({
	origin: env.FRONTEND_URL,
});

app.use(customExpressResponse.execute);
app.use(responseTimeListener.execute);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors);
app.use(routes);
