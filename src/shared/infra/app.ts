import express from 'express';
import Cors from 'cors';
import { container } from 'tsyringe';
import { env } from 'process';
import { ResponseTimeListener } from './https/middlewares/response-time-listener';
import { CustomExpressResponse } from './https/middlewares/custom-express-response';
import { routes } from './https/routes';

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
