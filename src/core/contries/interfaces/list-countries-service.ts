import { Service } from '@shared/interfaces/service';
import { Country } from '../entities/country';

export interface Input {
	fields?: Record<string, unknown>;
}

export interface Output {
	data: Country[];
}

export interface ListCountriesService extends Service<Input, Output> {
	execute(input: Input): Promise<Output>;
}
