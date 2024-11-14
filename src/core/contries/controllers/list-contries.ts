import { inject, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { isTrue } from '@shared/utils/isTrue';
import { z } from 'zod';
import { Controller } from '../../../shared/interfaces/controller';
import { Country } from '../entities/country';
import { ListCountriesService } from '../interfaces/list-countries-service';

@injectable()
export class ListCountries extends Controller {
	public constructor(
		@inject('ListCountriesService')
		readonly listCountriesService: ListCountriesService,
	) {
		super();
	}

	async execute(req: Request, res: Response): Promise<void> {
		try {
			const querySchema = z.object({
				name: z.boolean().default(true),
				code: z.boolean().default(true),
				image: z.boolean().default(true),
				'image.name': z.boolean().default(true),
				'image.flag': z.boolean().default(true),
				'image.iso2': z.boolean().default(true),
				'image.iso3': z.boolean().default(true),
				population: z.boolean().default(true),
				'population.year': z.boolean().default(true),
				'population.value': z.boolean().default(true),
				borders: z.boolean().default(true),
				'borders.commonName': z.boolean().default(true),
				'borders.officialName': z.boolean().default(true),
				'borders.countryCode': z.boolean().default(true),
				'borders.region': z.boolean().default(true),
				'borders.borders': z.boolean().default(true),
			});
			const queryParsedResponse = await querySchema.safeParseAsync(req.query);
			const querySuccess = isTrue.execute([
				queryParsedResponse.success,
				queryParsedResponse.data,
			]);

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

			const queryData: Record<string, boolean> = queryParsedResponse.data!;
			const fields: Record<string, z.infer<typeof querySchema>> = {};

			Object.entries(queryData).forEach(([item, value]) => {
				const keys = item.split('.');
				let current = fields as Record<string, unknown>;

				for (let i = 0; i < keys.length - 1; i++) {
					if (typeof current[keys[i]] === 'boolean') current[keys[i]] = {};
					if (!current[keys[i]]) current[keys[i]] = {};
					current = current[keys[i]] as Record<string, unknown>;
				}

				current[keys[keys.length - 1]] = value;
			});

			const { data } = await this.listCountriesService.execute({ fields });

			const output = data.reduce<Array<Record<string, Partial<Country>>>>(
				(acc, item) => {
					const result = this.filterProps<
						Partial<Country>,
						z.infer<typeof querySchema>
					>(item.toJSON() as {}, fields);
					if (Object.values(result).length > 0) acc.push(result);
					return acc;
				},
				[],
			);

			res.json(output).status(200).end();
		} catch (error) {
			const output = {
				errors: [`Internal server error`],
			};

			res.status(500).json(output).end();
		}
	}
}
