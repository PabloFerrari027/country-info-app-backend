import { ContriesRoutes } from '@/core/contries/routes/countries.routes';
import { Router } from 'express';

export class Routes {
	static readonly router = Router();

	static execute(): void {
		ContriesRoutes.execute();
		this.router.use(ContriesRoutes.router);
	}
}
