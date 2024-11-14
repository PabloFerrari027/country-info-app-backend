import {
	CountryBorder,
	CountryBorderJSON,
} from './value-objects/country-border';
import { CountryImage, CountryImageJSON } from './value-objects/country-image';
import {
	CountryPopulation,
	CountryPopulationJSON,
} from './value-objects/country-population';

export interface CountryProps {
	name: string;
	code: string;
	image: CountryImage | null;
	population: CountryPopulation[];
	borders: CountryBorder[];
}

export interface CountryJSON {
	name: string;
	code: string;
	image: CountryImageJSON | null;
	population: CountryPopulationJSON[];
	borders: CountryBorderJSON[];
}

export class Country {
	readonly props: CountryProps;

	constructor(props: CountryProps) {
		this.props = props;
	}

	get image(): CountryImage | null {
		return this.props.image;
	}

	get name(): string {
		return this.props.name;
	}

	get code(): string {
		return this.props.code;
	}

	get population(): CountryPopulation[] {
		return this.props.population;
	}

	get borders(): CountryBorder[] {
		return this.props.borders;
	}

	toJSON(): CountryJSON {
		const code = this.code;
		const name = this.name;
		const borders = this.borders.map(bordder => bordder.toJSON());
		const image = this.image?.toJSON() ?? null;
		const population = this.population.map(population => population.toJSON());

		const output: CountryJSON = {
			name,
			code,
			image,
			population,
			borders,
		};

		return output;
	}

	static create(props: CountryProps): Country {
		const country = new Country(props);
		return country;
	}
}
