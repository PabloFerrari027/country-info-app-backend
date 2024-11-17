import { MakeCountriesRepository } from '@/core/contries/factories/make-countries-repository';
import { CountriesRepository } from '@/core/contries/repositories/contries-repository';

interface Params {
	type: 'PRODUCTION';
}

interface Repositories {
	CountriesRepository: CountriesRepository;
}

export class MakeAllRepositories {
	private static _repositories: Repositories;

	static execute(params: Params): void {
		this._repositories = {
			CountriesRepository: MakeCountriesRepository.execute({
				type: params.type,
			}),
		};
	}

	static get repositories(): Repositories {
		return this._repositories;
	}
}
