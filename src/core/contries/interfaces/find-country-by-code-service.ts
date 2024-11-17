import { Service } from '@shared/agreements/service';
import { Country } from '../entities/country';

export interface Input {
	code: string;
}

export interface Output {
	data: Country | null;
}

export interface FindCountryByCodeService extends Service<Input, Output> {
	execute(input: Input): Promise<Output>;
}
