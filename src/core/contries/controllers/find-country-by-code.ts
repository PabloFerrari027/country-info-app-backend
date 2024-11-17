import { inject, injectable } from 'tsyringe';
import { z } from 'zod';
import {
	Controller,
	Input as _Input,
} from '../../../shared/agreements/controller';
import { Country, CountryJSON } from '../entities/country';
import { RequestSuccess } from '@shared/DTO/request-success';
import { RequestError } from '@shared/DTO/request-error';
import { FindCountryByCodeService } from '../interfaces/find-country-by-code-service';

export type Input = _Input;

type Success = Partial<CountryJSON>;
type Error = unknown;

export type Output = Promise<RequestSuccess<Success> | RequestError<Error>>;

@injectable()
export class FindCountryByCode extends Controller {
	public constructor(
		@inject('FindCountryByCodeService')
		readonly findCountryByCodeService: FindCountryByCodeService,
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
			const paramsSchema = z.object({
				code: z.string(),
			});

			const queryParsedResponse = await querySchema.safeParseAsync(input.query);
			const paramsParsedResponse = await paramsSchema.safeParseAsync(
				input.params,
			);

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

			if (!paramsParsedResponse.success || !paramsParsedResponse.data) {
				const errors =
					paramsParsedResponse.error?.issues.map(err => ({
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
			const paramsData: z.infer<typeof paramsSchema> =
				paramsParsedResponse.data;

			const fields: Record<string, unknown> = {};

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
				let current = fields;

				for (let i = 0; i < keys.length - 1; i++) {
					if (typeof current[keys[i]] === 'boolean') current[keys[i]] = {};
					if (!current[keys[i]]) current[keys[i]] = {};
					current = current[keys[i]] as Record<string, unknown>;
				}

				current[keys[keys.length - 1]] = value;
			});

			const code = paramsData.code;

			const { data: country } = await this.findCountryByCodeService.execute({
				code,
			});

			if (!country) {
				const errors = ['Resource is not found'];
				const output = {
					status: 404,
					data: { errors },
				};

				return output;
			}

			const result = this.filterProps<
				Partial<Country>,
				z.infer<typeof querySchema>
			>(country.toJSON() as {}, fields as {});

			const output: RequestSuccess<Success> = {
				data: result,
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
