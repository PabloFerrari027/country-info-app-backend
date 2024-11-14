import { ListingResponse } from '@shared/types/listing-response';
import { Country } from '../entities/country';

export interface CountriesRepository {
	create(country: Country): Promise<Country>;
	findByName(
		name: string,
		options?: { fields?: Record<string, boolean> },
	): Promise<Country | null>;
	list(options?: {
		fields?: Record<string, unknown>;
	}): Promise<ListingResponse<Country>>;
}
