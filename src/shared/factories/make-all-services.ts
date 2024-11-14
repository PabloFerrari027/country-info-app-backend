import { MakeCountriesServices } from '@/core/contries/factories/make-countries-services';

export class MakeAllServices {
	static execute(): void {
		MakeCountriesServices.execute();
	}
}
