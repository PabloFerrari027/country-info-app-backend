import { createClient } from 'redis';
import env from '@shared/env';

export const redis = createClient({ url: env.REDIS_URL });
redis.connect();
