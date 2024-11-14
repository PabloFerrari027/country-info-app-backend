import { container } from 'tsyringe';
import { CountriesRepository } from '../repositories/contries-repository';
import { APICountriesRepository } from '../implementations/API-contries-repository';
import { InMemoryContriesRepository } from '../implementations/in-memory-countries-reposiory';

interface Params {
	type: 'PRODUCTION' | 'IN MEMORY';
}

export class MakeCountriesRepository {
	private static repository: CountriesRepository;
	static readonly key = 'CountriesRepository';

	static execute(params: Params): CountriesRepository {
		switch (params.type) {
			case 'IN MEMORY': {
				this.repository = container.resolve(InMemoryContriesRepository);
				container.registerInstance(this.key, this.repository);
				return this.repository;
			}

			case 'PRODUCTION': {
				this.repository = container.resolve(APICountriesRepository);
				container.registerInstance(this.key, this.repository);
				return this.repository;
			}

			default: {
				throw new Error('Invalid type');
			}
		}
	}
}
