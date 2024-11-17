export interface RequestError<T> {
	status: number;
	data: {
		errors: T[];
	};
}
