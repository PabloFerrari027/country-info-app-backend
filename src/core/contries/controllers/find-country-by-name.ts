import { container, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { FindCountryByName as FindCountryByNameService } from '../services/find-country-by-name';
import { z } from 'zod';
import { isTrue } from '@shared/utils/isTrue';

@injectable()
export class FindCountryByName {
	async execute(req: Request, res: Response): Promise<void> {
		try {
			const paramsSchema = z.object({
				name: z.string(),
			});

			const queerySchema = z.object({
				name: z.boolean().optional(),
				code: z.boolean().optional(),
				image: z.boolean().optional(),
				'image.name': z.boolean().optional(),
				'image.flag': z.boolean().optional(),
				'image.iso2': z.boolean().optional(),
				'image.iso3': z.boolean().optional(),
				population: z.boolean().optional(),
				'population.year': z.boolean().optional(),
				'population.value': z.boolean().optional(),
				borders: z.boolean().optional(),
				'borders.commonName': z.boolean().optional(),
				'borders.officialName': z.boolean().optional(),
				'borders.countryCode': z.boolean().optional(),
				'borders.region': z.boolean().optional(),
				'borders.borders': z.boolean().optional(),
			});

			const paramsParsedResponse = await paramsSchema.safeParseAsync(
				req.params,
			);
			const queryParsedResponse = await queerySchema.safeParseAsync(req.query);

			const paramsSuccess = isTrue.execute([
				paramsParsedResponse.success,
				paramsParsedResponse.data,
			]);

			const querySuccess = isTrue.execute([
				queryParsedResponse.success,
				queryParsedResponse.data,
			]);

			if (!paramsSuccess) {
				const errors = paramsParsedResponse.error?.issues.map(err => ({
					path: err.path,
					message: err.message,
				}));

				const output = {
					errors,
				};

				res.json(output).status(400).end();
				return;
			}

			if (!querySuccess) {
				const errors = queryParsedResponse.error?.issues.map(err => ({
					path: err.path,
					message: err.message,
				}));

				const output = {
					errors,
				};

				res.json(output).status(400).end();
				return;
			}

			const paramsData: z.infer<typeof paramsSchema> =
				paramsParsedResponse.data!;
			const queryData: z.infer<typeof queerySchema> = queryParsedResponse.data!;

			const { name } = paramsData;
			const fields = queryData;

			const findCountryByName = container.resolve(FindCountryByNameService);

			const { country } = await findCountryByName.execute({ name, fields });

			if (!country) {
				const output = {
					errors: [`Resource not found`],
				};

				res.json(output).status(404).end();
				return;
			}

			const output = country.toJSON();
			res.json(output).status(200).end();
		} catch (error) {
			const output = {
				errors: [`Internal server error`],
			};

			res.json(output).status(404).end();
		}
	}
}
