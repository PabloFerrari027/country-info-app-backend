import { inject, injectable } from 'tsyringe';
import { CountriesRepository } from '../repositories/contries-repository';
import {
	ListCountriesService,
	Input,
	Output,
} from '../interfaces/list-countries-service';

@injectable()
export class ListCountries implements ListCountriesService {
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
