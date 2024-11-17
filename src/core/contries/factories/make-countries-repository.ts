import { container } from 'tsyringe';
import { CountriesRepository } from '../repositories/contries-repository';
import { APICountriesRepository } from '../implementations/API-contries-repository';

interface Params {
	type: 'PRODUCTION';
}

export class MakeCountriesRepository {
	private static repository: CountriesRepository;
	static readonly key = 'CountriesRepository';

	static execute(params: Params): CountriesRepository {
		switch (params.type) {
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
