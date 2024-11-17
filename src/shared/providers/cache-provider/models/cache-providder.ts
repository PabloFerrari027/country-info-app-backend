export type Data<T> = T & { id: number | string; expiresIn: number };

export interface CacheProvider {
	save<T>(data: Data<T>): Promise<void>;
	findById<T>(id: number | string): Promise<T | null>;
}
