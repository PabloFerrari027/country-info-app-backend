export interface CountryImageProps {
	name: string;
	flag: string;
	iso2: string;
	iso3: string;
}

export interface CountryImageJSON {
	name: string;
	flag: string;
	iso2: string;
	iso3: string;
}

export class CountryImage {
	private props: CountryImageProps;

	constructor(props: CountryImageProps) {
		this.props = props;
	}

	get name(): string {
		return this.props.name;
	}

	get flag(): string {
		return this.props.flag;
	}

	get iso2(): string {
		return this.props.iso2;
	}

	get iso3(): string {
		return this.props.iso3;
	}

	toJSON(): CountryImageJSON {
		const output: CountryImageJSON = {
			flag: this.props.flag,
			iso2: this.props.iso2,
			iso3: this.props.iso3,
			name: this.props.name,
		};

		return output;
	}

	static create(props: CountryImageProps): CountryImage {
		const countryImage = new CountryImage(props);
		return countryImage;
	}
}
