import { MakeCacheProvider } from '@shared/providers/cache-provider/factories/make-cache-provider';
import { CacheProvider } from '@shared/providers/cache-provider/models/cache-providder';

interface Params {
	type: 'PRODUCTION';
}

interface Providers {
	CacheProvider: CacheProvider;
}

export class MakeAllProviders {
	private static _providers: Providers;

	static execute(params: Params): void {
		this._providers = {
			CacheProvider: MakeCacheProvider.execute({
				type: params.type,
			}),
		};
	}

	static get providers(): Providers {
		return this._providers;
	}
}
