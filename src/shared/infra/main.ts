import 'reflect-metadata';
import express from 'express';
import Cors from 'cors';
import { container } from 'tsyringe';
import { env } from 'process';
import { ResponseTimeListener } from './https/middlewares/response-time-listener';
import { CustomExpressResponse } from './https/middlewares/custom-express-response';
import { Routes } from './https/routes';
import { MakeAllProviders } from '@shared/factories/make-all-providers';
import { MakeAllRepositories } from '@shared/factories/make-all-repositories';
import { MakeAllServices } from '@shared/factories/make-all-services';
import { app } from './app';

class Main {
	static execute(): void {
		MakeAllProviders.execute({ type: 'PRODUCTION' });
		MakeAllRepositories.execute({ type: 'PRODUCTION' });
		MakeAllServices.execute();
		Routes.execute();

		const routes = Routes.router;
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
	}
}

Main.execute();
