export interface CountryBorderProps {
	commonName: string;
	officialName: string;
	countryCode: string;
	region: string;
	borders: CountryBorder[];
}

export interface CountryBorderJSON {
	commonName: string;
	officialName: string;
	countryCode: string;
	region: string;
	borders: CountryBorderJSON[];
}

export class CountryBorder {
	readonly props: CountryBorderProps;

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

	toJSON(): CountryBorderJSON {
		const output: CountryBorderJSON = {
			countryCode: this.props.countryCode,
			commonName: this.props.commonName,
			officialName: this.props.officialName,
			region: this.props.region,
			borders: this.props.borders.map(border => border.toJSON()),
		};

		return output;
	}

	static create(props: CountryBorderProps): CountryBorder {
		const countryBorder = new CountryBorder(props);
		return countryBorder;
	}
}
