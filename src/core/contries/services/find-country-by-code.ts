import { inject, injectable } from 'tsyringe';
import { CountriesRepository } from '../repositories/contries-repository';
import {
	FindCountryByCodeService,
	Input,
	Output,
} from '../interfaces/find-country-by-code-service';

@injectable()
export class FindCountryByCode implements FindCountryByCodeService {
	constructor(
		@inject('CountriesRepository')
		readonly countriesRepository: CountriesRepository,
	) {}

	async execute(input: Input): Promise<Output> {
		const country = await this.countriesRepository.findByCode(input.code);
		const output: Output = { data: country };
		return output;
	}
}
