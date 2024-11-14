import { container } from 'tsyringe';
import { ListCountries } from '../services/list-countries';

export class MakeCountriesServices {
	static execute(): void {
		const services = [{ service: ListCountries, key: 'ListCountriesService' }];

		for (const item of services) {
			container.register(item.key, {
				useClass: item.service,
			});
		}
	}
}
