import { ListingResponse } from '@shared/types/listing-response';
import { Country } from '../entities/country';
import { CountriesRepository } from '../repositories/contries-repository';
import { singleton } from 'tsyringe';
import { CountryImage } from '../entities/value-objects/country-image';
import { CountryBorder } from '../entities/value-objects/country-border';
import { CountryPopulation } from '../entities/value-objects/country-population';

interface CountryResponse {
	countryCode: string;
	name: string;
}

type CountriesResponse = CountryResponse[];

interface Border {
	commonName: string;
	officialName: string;
	countryCode: string;
	region: string;
	borders: Border[] | null;
}

type BodersResponse = Border[];

interface Population {
	country: string;
	code: string;
	iso3: string;
	populationCounts: Array<{ year: 1960; value: 92197753 }>;
}

interface PopulationResponse {
	error: boolean;
	msg: string;
	data: Population[];
}

interface Image {
	name: string;
	flag?: string;
	iso2: string;
	iso3: string;
}

interface ImagesResponse {
	error: boolean;
	data: Image[];
}

@singleton()
export class APICountriesRepository implements CountriesRepository {
	async create(country: Country): Promise<Country> {
		throw new Error('Method not implemented.');
	}

	async findByName(name: string): Promise<Country | null> {
		return null;
	}

	async list(): Promise<ListingResponse<Country>> {
		const responses = await Promise.all([
			fetch('https://date.nager.at/api/v3/AvailableCountries'),
			fetch('https://countriesnow.space/api/v0.1/countries/flag/images'),
			fetch('https://countriesnow.space/api/v0.1/countries/population'),
		]);

		const countries: CountriesResponse = await responses[0].json();
		const images: ImagesResponse = await responses[1].json();
		const population: PopulationResponse = await responses[2].json();
		const borders: BodersResponse = await Promise.all(
			countries.map(async country => {
				const response = await fetch(
					`https://date.nager.at/api/v3/CountryInfo/${country.countryCode}`,
				);

				return await response.json();
			}),
		);

		const handleBorder = (border: Border): CountryBorder => {
			const borders = border.borders?.map(border => handleBorder(border)) ?? [];
			const countryCode = border.countryCode;
			const officialName = border.officialName;
			const region = border.region;

			return CountryBorder.create({
				borders,
				commonName: border.commonName,
				countryCode,
				officialName,
				region,
			});
		};

		const output = countries.map(item => {
			const code = item.countryCode;
			const name = item.name;

			const _borders = borders
				.filter(border => border.countryCode === code)
				.map(border => handleBorder(border));

			const _image = images.data.find(
				img => img.iso2 === code || img.iso3 === code || img.name === name,
			);

			let image: CountryImage | null = null;

			if (_image) {
				image = CountryImage.create({
					flag: _image.flag ?? '',
					iso2: _image.iso2,
					iso3: _image.iso3,
					name: _image.name,
				});
			}

			const _population = population.data
				.filter(population => population.country === item.name)
				.reduce<CountryPopulation[]>((acc, item) => {
					const population = item.populationCounts.map(count =>
						CountryPopulation.create({ value: count.value, year: count.year }),
					);

					acc.push(...population);

					return acc;
				}, []);

			return Country.create({
				code,
				name,
				borders: _borders,
				image,
				population: _population,
			});
		});

		return { data: output };
	}
}
