export abstract class Service<I, R> {
	abstract execute(input: I): Promise<R>;
}
