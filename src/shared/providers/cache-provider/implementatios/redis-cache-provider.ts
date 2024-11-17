import { redis } from '@shared/infra/config/redis';
import { CacheProvider, Data } from '../models/cache-providder';

export class RedisCacheProvider implements CacheProvider {
	async save<T>(data: Data<T>): Promise<void> {
		await redis.set(String(data.id), JSON.stringify(data));
	}

	async findById<T>(id: number | string): Promise<T | null> {
		const resurce = await redis.get(String(id));
		if (!resurce) return null;
		const output = JSON.parse(resurce);
		return output;
	}
}
