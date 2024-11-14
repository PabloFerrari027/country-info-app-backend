import { Router } from 'express';
import { container } from 'tsyringe';
import { ListCountries } from '../controllers/list-contries';
import { FindCountryByName } from '../controllers/find-country-by-name';

export const contriesRoutes = Router();

const listCountries = container.resolve(ListCountries);
const findCountryByName = container.resolve(FindCountryByName);

contriesRoutes.get('/list', async (req, res) => {
	await listCountries.execute(req, res);
});

contriesRoutes.get('/find/by/name/:name', findCountryByName.execute);
