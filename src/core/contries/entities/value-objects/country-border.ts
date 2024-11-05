export interface CountryBorderProps {
	commonName: string;
	officialName: string;
	countryCode: string;
	region: string;
	borders: null;
}

export interface CountryBorderJSON {
	commonName: string;
	officialName: string;
	countryCode: string;
	region: string;
	borders: null;
}

export class CountryBorder {
	private props: CountryBorderProps;

	constructor(props: CountryBorderProps) {
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

	get borders(): null {
		return this.props.borders;
	}

	toJSON(): CountryBorderJSON {
		const output: CountryBorderJSON = {
			borders: this.props.borders,
			commonName: this.props.commonName,
			countryCode: this.props.countryCode,
			officialName: this.props.officialName,
			region: this.props.region,
		};

		return output;
	}

	static create(props: CountryBorderProps): CountryBorder {
		const countryBorder = new CountryBorder(props);
		return countryBorder;
	}
}
