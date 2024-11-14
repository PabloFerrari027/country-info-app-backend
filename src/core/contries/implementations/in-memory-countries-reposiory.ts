import { singleton } from 'tsyringe';
import { Country } from '../entities/country';
import { CountriesRepository } from '../repositories/contries-repository';
import { ListingResponse } from '@shared/types/listing-response';

@singleton()
export class InMemoryContriesRepository implements CountriesRepository {
	readonly items: Country[] = [];

	async create(country: Country): Promise<Country> {
		this.items.push(country);
		return country;
	}

	async findByName(name: string): Promise<Country | null> {
		return this.items.find(country => country.commonName === name) ?? null;
	}

	async list(): Promise<ListingResponse<Country>> {
		return { data: this.items };
	}
}
