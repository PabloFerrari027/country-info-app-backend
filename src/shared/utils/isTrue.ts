type Input = unknown[];
type Output = boolean;

export class isTrue {
	static execute(input: Input): Output {
		return !!input.filter(item => !!item);
	}
}
