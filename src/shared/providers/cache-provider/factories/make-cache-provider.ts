import { container } from 'tsyringe';
import { CacheProvider } from '../models/cache-providder';
import { RedisCacheProvider } from '../implementatios/redis-cache-provider';

interface Params {
	type: 'PRODUCTION';
}

export class MakeCacheProvider {
	private static provider: CacheProvider;
	static readonly key = 'CacheProvider';

	static execute(params: Params): CacheProvider {
		switch (params.type) {
			case 'PRODUCTION': {
				this.provider = container.resolve(RedisCacheProvider);
				container.registerInstance(this.key, this.provider);
				return this.provider;
			}

			default: {
				throw new Error('Invalid type');
			}
		}
	}
}
