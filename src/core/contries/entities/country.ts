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
	commonName: string;
	officialName: string;
	countryCode: string;
	region: string;
	image: CountryImage;
	country: string;
	code: string;
	iso3: string;
	populationCounts: Array<CountryPopulation>;
	borders: Array<CountryBorder>;
}

export interface CountryJSON {
	commonName: string;
	officialName: string;
	countryCode: string;
	region: string;
	image: CountryImageJSON;
	country: string;
	code: string;
	iso3: string;
	populationCounts: Array<CountryPopulationJSON>;
	borders: Array<CountryBorderJSON>;
}

export class Country {
	private props: CountryProps;

	constructor(props: CountryProps) {
		this.props = props;
	}

	get commonName(): string {
		return this.props.commonName;
	}

	get officialName(): string {
		return this.props.officialName;
	}

	get countryCode(): string {
		return this.props.countryCode;
	}

	get region(): string {
		return this.props.region;
	}

	get image(): CountryImage {
		return this.props.image;
	}

	get country(): string {
		return this.props.country;
	}

	get code(): string {
		return this.props.code;
	}

	get iso3(): string {
		return this.props.iso3;
	}

	get populationCounts(): Array<CountryPopulation> {
		return this.props.populationCounts;
	}

	get borders(): Array<CountryBorder> {
		return this.props.borders;
	}

	toJSON(): CountryJSON {
		const code = this.code;
		const commonName = this.commonName;
		const country = this.country;
		const countryCode = this.countryCode;
		const iso3 = this.iso3;
		const officialName = this.officialName;
		const region = this.region;
		const borders = this.borders.map(bordder => bordder.toJSON());
		const image = this.image.toJSON();
		const populationCounts = this.populationCounts.map(populationCount =>
			populationCount.toJSON(),
		);

		const output: CountryJSON = {
			borders,
			code,
			commonName,
			country,
			countryCode,
			image,
			iso3,
			officialName,
			populationCounts,
			region,
		};

		return output;
	}

	static create(props: CountryProps): Country {
		const country = new Country(props);
		return country;
	}
}
