export interface CountryPopulationProps {
	year: number;
	value: number;
}

export interface CountryPopulationJSON {
	year: number;
	value: number;
}

export class CountryPopulation {
	readonly props: CountryPopulationProps;

	constructor(props: CountryPopulationProps) {
		this.props = props;
	}

	get year(): number {
		return this.props.year;
	}

	get value(): number {
		return this.props.value;
	}

	toJSON(): CountryPopulationJSON {
		const output: CountryPopulationJSON = {
			value: this.props.value,
			year: this.props.year,
		};

		return output;
	}

	static create(props: CountryPopulationProps): CountryPopulation {
		const countryPopulation = new CountryPopulation(props);
		return countryPopulation;
	}
}
