import { Request, Response } from 'express';

export abstract class Controller {
	filterProps<A, B>(
		data: Record<string, A>,
		filterKeys: Record<string, B>,
	): Record<string, A> {
		const output: Record<string, A> = {};

		for (const key in data) {
			if (
				filterKeys[key] &&
				typeof data[key] === 'object' &&
				data[key] !== null &&
				!Array.isArray(data[key])
			) {
				const result = this.filterProps<A, B>(
					data[key] as Record<string, A>,
					filterKeys[key] as Record<string, B>,
				);

				if (Object.values(result).length === 0) continue;

				output[key] = result as A;

				continue;
			}

			if (Array.isArray(data[key]) && filterKeys[key]) {
				const arr = data[key] as Array<Record<string, A>>;

				// const result = arr
				// 	.map(item => {
				// 		if (typeof item === 'object' && item !== null) {
				// 			return this.filterProps(item as {}, filterKeys[key] as {});
				// 		}

				// 		return item;
				// 	})
				// 	.filter(item => {
				// 		if (typeof item !== 'object') return true;
				// 		return Object.values(item as {}).length > 0;
				// 	});

				const result = arr.reduce<Array<Record<string, A>>>((acc, item) => {
					if (typeof item === 'object' && item !== null) {
						const result = this.filterProps<A, B>(
							item as {},
							filterKeys[key] as {},
						);

						if (Object.values(result).length > 0) acc.push(result);
						return acc;
					}

					acc.push(item);
					return acc;
				}, []);

				if (result.length === 0) continue;

				output[key] = result as A;

				continue;
			}

			if (filterKeys[key] && typeof filterKeys[key] === 'boolean') {
				output[key] = data[key];
				continue;
			}
		}

		return output;
	}

	abstract execute(req: Request, res: Response): Promise<void>;
}
