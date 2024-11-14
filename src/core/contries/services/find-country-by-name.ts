import { inject, injectable } from 'tsyringe';
import { CountriesRepository } from '../repositories/contries-repository';
import { Country } from '../entities/country';

interface Input {
	name: string;
	fields?: Record<string, boolean>;
}

interface Output {
	country: Country | null;
}

@injectable()
export class FindCountryByName {
	constructor(
		@inject('CountriesRepository')
		readonly countriesRepository: CountriesRepository,
	) {}

	async execute(input: Input): Promise<Output> {
		const country = await this.countriesRepository.findByName(input.name, {
			fields: input.fields,
		});
		const output: Output = { country };
		return output;
	}
}
