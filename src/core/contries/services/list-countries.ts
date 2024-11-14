import { inject, injectable } from 'tsyringe';
import { CountriesRepository } from '../repositories/contries-repository';
import { Country } from '../entities/country';

interface Input {
	fields?: Record<string, boolean>;
}

interface Output {
	data: Country[];
}

@injectable()
export class ListCountries {
	constructor(
		@inject('CountriesRepository')
		readonly countriesRepository: CountriesRepository,
	) {}

	async execute(input: Input): Promise<Output> {
		const { data } = await this.countriesRepository.list({
			fields: input.fields,
		});
		const output: Output = { data };
		return output;
	}
}
