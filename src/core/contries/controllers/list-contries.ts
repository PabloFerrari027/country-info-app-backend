import { container, injectable } from 'tsyringe';
import { Request, Response } from 'express';
import { ListCountries as ListCountriesService } from '../services/list-countries';
import { isTrue } from '@shared/utils/isTrue';
import { z } from 'zod';
import { Country } from '../entities/country';

function handleField(
	item: Record<string, any>,
	fields: Record<string, boolean>,
	currentField: string,
): Record<string, unknown> {
	const output: Record<string, unknown> = {};

	if (!item) return output;

	for (const [key, value] of Object.entries(item)) {
		let field = '';

		if (fields[`${currentField}.*.${key}`]) {
			field = currentField;
		} else {
			field = currentField ? `${currentField}.${key}` : key;
		}

		const hierarchies = field.split('.');
		let currentHierarchy = '';
		let isValid = fields[field];

		for (const field of hierarchies) {
			if (!isValid) continue;
			if (!currentHierarchy) currentHierarchy = field;
			else currentHierarchy += `.${field}`;
			if (!fields[currentHierarchy]) isValid = false;
		}

		if (!isValid) continue;

		if (Array.isArray(value)) {
			const results = value.map(v =>
				handleField(v as Record<string, any>, fields, field),
			);
			output[key] = results;
			continue;
		}

		if (typeof value === 'object' && value !== null) {
			const result = handleField(value as Record<string, any>, fields, field);
			if (Object.keys(result).length > 0) output[key] = result;
			continue;
		}

		output[key] = value;
	}

	return output;
}

function handleFields(
	fields: Record<string, boolean>,
	country: Country,
): Record<string, unknown> {
	const json = country.toJSON() as Record<string, any>;
	return handleField(json, fields, '');
}

@injectable()
export class ListCountries {
	async execute(req: Request, res: Response): Promise<void> {
		try {
			const queerySchema = z.object({
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

			const queryParsedResponse = await queerySchema.safeParseAsync(req.query);

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

			if (queryData['borders.commonName']) {
				queryData['borders.*.commonName'] = true;
				delete queryData['borders.commonName'];
			}

			if (queryData['borders.officialName']) {
				queryData['borders.*.officialName'] = true;
				delete queryData['borders.officialName'];
			}

			if (queryData['borders.countryCode']) {
				queryData['borders.*.countryCode'] = true;
				delete queryData['borders.countryCode'];
			}

			if (queryData['borders.region']) {
				queryData['borders.*.region'] = true;
				delete queryData['borders.region'];
			}

			if (queryData['borders.borders']) {
				queryData['borders.*.borders'] = true;
				delete queryData['borders.borders'];
			}

			const fields = queryData;

			const listCountries = container.resolve(ListCountriesService);

			const { data } = await listCountries.execute({ fields });

			const output = data.map(country => handleFields(fields, country));
			res.json(output).status(200).end();
		} catch (error) {
			const output = {
				errors: [`Internal server error`],
			};

			res.json(output).status(404).end();
		}
	}
}
