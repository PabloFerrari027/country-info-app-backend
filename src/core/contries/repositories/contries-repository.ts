import { ListingResponse } from '@shared/types/listing-response';
import { Country } from '../entities/country';

export interface CountriesRepository {
	findByCode(code: string): Promise<Country | null>;
	list(): Promise<ListingResponse<Country>>;
}
