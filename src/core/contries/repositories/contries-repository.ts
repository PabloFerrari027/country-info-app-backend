import { ListingParams } from '@shared/types/listing-params';
import { Country } from '../entities/country';

export interface ContriesRepository {
	findByName(name: string): Country;
	list(params?: ListingParams): Country;
}
