import { Service } from '@shared/agreements/service';
import { Country } from '../entities/country';

export interface Input {}

export interface Output {
	data: Country[];
}

export interface ListCountriesService extends Service<Input, Output> {
	execute(input: Input): Promise<Output>;
}
