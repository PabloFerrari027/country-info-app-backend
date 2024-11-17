import { Router } from 'express';
import { container } from 'tsyringe';
import { ListCountries } from '../controllers/list-contries';
import { FindCountryByCode } from '../controllers/find-country-by-code';

export class ContriesRoutes {
	static readonly router = Router();

	static execute(): void {
		const listCountries = container.resolve(ListCountries);
		const findCountryByCode = container.resolve(FindCountryByCode);

		this.router.get('/countries/list', async (req, res) => {
			const body = req.body;
			const query = req.query;
			const params = req.params;

			const response = await listCountries.execute({
				body,
				params,
				query,
			});

			res.status(response.status).json(response.data).end();
		});

		this.router.get('/countries/find/by/code/:code', async (req, res) => {
			const body = req.body;
			const query = req.query;
			const params = req.params;

			const response = await findCountryByCode.execute({
				body,
				params,
				query,
			});

			res.status(response.status).json(response.data).end();
		});
	}
}
