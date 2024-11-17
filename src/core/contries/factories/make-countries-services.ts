/* eslint-disable @typescript-eslint/no-explicit-any */
import { container } from 'tsyringe';
import { ListCountries } from '../services/list-countries';
import { FindCountryByCode } from '../services/find-country-by-code';

type Services = Array<{
	service: any;
	key: string;
}>;

export class MakeCountriesServices {
	static services: Services = [
		{ service: ListCountries, key: 'ListCountriesService' },
		{ service: FindCountryByCode, key: 'FindCountryByCodeService' },
	];

	static execute(): void {
		for (const item of this.services) {
			container.register(item.key, { useClass: item.service });
		}
	}
}
