import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import {
	Controller,
	Input as _Input,
} from '../../../shared/agreements/controller';
import { Country, CountryJSON } from '../entities/country';
import { ListCountriesService } from '../interfaces/list-countries-service';
import { RequestSuccess } from '@shared/DTO/request-success';
import { RequestError } from '@shared/DTO/request-error';

export type Input = _Input;

type Success = Array<Partial<CountryJSON>>;
type Error = unknown;

export type Output = Promise<RequestSuccess<Success> | RequestError<Error>>;

@injectable()
export class ListCountries extends Controller {
	public constructor(
		@inject('ListCountriesService')
		readonly listCountriesService: ListCountriesService,
	) {
		super();
	}

	async execute(input: Input): Output {
		try {
			const querySchema = z.object({
				name: z.coerce.boolean().optional(),
				code: z.coerce.boolean().optional(),
				'image.name': z.coerce.boolean().optional(),
				'image.flag': z.coerce.boolean().optional(),
				'image.iso2': z.coerce.boolean().optional(),
				'image.iso3': z.coerce.boolean().optional(),
				'population.year': z.coerce.boolean().optional(),
				'population.value': z.coerce.boolean().optional(),
				'borders.commonName': z.coerce.boolean().optional(),
				'borders.officialName': z.coerce.boolean().optional(),
				'borders.countryCode': z.coerce.boolean().optional(),
				'borders.region': z.coerce.boolean().optional(),
				'borders.borders': z.coerce.boolean().optional(),
			});
			const queryParsedResponse = await querySchema.safeParseAsync(input.query);

			if (!queryParsedResponse.success || !queryParsedResponse.data) {
				const errors =
					queryParsedResponse.error?.issues.map(err => ({
						path: err.path,
						message: err.message,
					})) ?? [];

				const output = {
					status: 400,
					data: { errors },
				};

				return output;
			}

			const queryData: Record<string, boolean> = queryParsedResponse.data;
			const fields: Record<string, z.infer<typeof querySchema>> = {};

			if (Object.values(queryData).length === 0) {
				queryData.name = true;
				queryData.code = true;
				queryData['image.name'] = true;
				queryData['image.flag'] = true;
				queryData['image.iso2'] = true;
				queryData['image.iso3'] = true;
				queryData['population.year'] = true;
				queryData['population.value'] = true;
				queryData['borders.commonName'] = true;
				queryData['borders.officialName'] = true;
				queryData['borders.countryCode'] = true;
				queryData['borders.region'] = true;
				queryData['borders.borders'] = true;
			}

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

			const { data: countries } = await this.listCountriesService.execute({
				fields,
			});

			const data = countries.reduce<Array<Record<string, Partial<Country>>>>(
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

			const output: RequestSuccess<Success> = {
				data,
				status: 200,
			};

			return output;
		} catch (error) {
			const output = {
				status: 500,
				data: {
					errors: [`Internal server error`],
				},
			};

			return output;
		}
	}
}
