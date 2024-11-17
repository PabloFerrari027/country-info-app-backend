import { ListingResponse } from '@shared/types/listing-response';
import { Country, CountryJSON } from '../entities/country';
import { CountriesRepository } from '../repositories/contries-repository';
import { inject, singleton } from 'tsyringe';
import { CountryImage } from '../entities/value-objects/country-image';
import {
	CountryBorder,
	CountryBorderJSON,
} from '../entities/value-objects/country-border';
import { CountryPopulation } from '../entities/value-objects/country-population';
import { CacheProvider } from '@shared/providers/cache-provider/models/cache-providder';

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

interface CountryCache extends CountryJSON {
	id: string | number;
	expiresIn: number;
}

interface ListingCache {
	id: string | number;
	ids: Array<string | number>;
	expiresIn: number;
}

@singleton()
export class APICountriesRepository implements CountriesRepository {
	constructor(
		@inject('CacheProvider')
		readonly cacheProvider: CacheProvider,
	) {}

	async findByCode(code: string): Promise<Country | null> {
		const cache = await this.cacheProvider.findById<CountryCache>(code);
		const currentDate = new Date().getTime();
		const cacheIsValid = cache && currentDate < cache.expiresIn;

		if (cacheIsValid) {
			const handleBorder = (border: CountryBorderJSON): CountryBorder => {
				return CountryBorder.create({
					borders: border.borders.map(border => handleBorder(border)),
					commonName: border.commonName,
					countryCode: border.countryCode,
					officialName: border.officialName,
					region: border.region,
				});
			};

			const borders = cache.borders.map(border => handleBorder(border));
			const population = cache.population.map(population =>
				CountryPopulation.create({
					value: population.value,
					year: population.year,
				}),
			);
			const image = cache.image
				? CountryImage.create({
						flag: cache.image.flag,
						iso2: cache.image.iso2,
						iso3: cache.image.iso3,
						name: cache.image.name,
					})
				: null;

			const country = Country.create({
				code: cache.code,
				name: cache.name,
				borders,
				image,
				population,
			});

			return country;
		}

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

		const found = countries.find(country => country.countryCode === code);

		if (!found) return null;

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

		const name = found.name;

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
			.filter(population => population.country === found.name)
			.reduce<CountryPopulation[]>((acc, item) => {
				const population = item.populationCounts.map(count =>
					CountryPopulation.create({ value: count.value, year: count.year }),
				);

				acc.push(...population);

				return acc;
			}, []);

		const country = Country.create({
			code,
			name,
			borders: _borders,
			image,
			population: _population,
		});

		const json = country.toJSON();

		const date = new Date();
		date.setDate(date.getDate() + 1);
		const expiresIn = date.getTime();

		await this.cacheProvider.save({ id: json.code, expiresIn, ...json });

		return country;
	}

	async list(): Promise<ListingResponse<Country>> {
		const listingCache =
			await this.cacheProvider.findById<ListingCache>('list-countries');

		const currentDate = new Date().getTime();

		const listingCacheIsValid =
			listingCache && currentDate < listingCache.expiresIn;

		const listCountriesByCache = async (
			ids: Array<number | string>,
		): Promise<Country[]> => {
			const countries: Country[] = [];

			const handleBorder = (border: CountryBorderJSON): CountryBorder => {
				return CountryBorder.create({
					borders: border.borders.map(border => handleBorder(border)),
					commonName: border.commonName,
					countryCode: border.countryCode,
					officialName: border.officialName,
					region: border.region,
				});
			};

			for (const id of ids) {
				const cache = await this.cacheProvider.findById<CountryCache>(id);
				const currentDate = new Date().getTime();
				const cacheIsValid = cache && currentDate < cache.expiresIn;

				if (!cacheIsValid) return [];

				const borders = cache.borders.map(border => handleBorder(border));
				const population = cache.population.map(population =>
					CountryPopulation.create({
						value: population.value,
						year: population.year,
					}),
				);
				const image = cache.image
					? CountryImage.create({
							flag: cache.image.flag,
							iso2: cache.image.iso2,
							iso3: cache.image.iso3,
							name: cache.image.name,
						})
					: null;

				const country = Country.create({
					code: cache.code,
					name: cache.name,
					borders,
					image,
					population,
				});

				countries.push(country);
			}

			return countries;
		};

		if (listingCacheIsValid) {
			const ids = listingCache.ids;
			const countries = await listCountriesByCache(ids);
			const output = { data: countries };

			if (countries.length > 0) return output;
		}

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

		const date = new Date();
		date.setDate(date.getDate() + 1);
		const expiresIn = date.getTime();

		const ids = countries.map(country => country.countryCode);

		await this.cacheProvider.save({ id: 'list-countries', expiresIn, ids });

		for await (const country of output) {
			await this.cacheProvider.save({
				id: country.code,
				expiresIn,
				...country.toJSON(),
			});
		}

		return { data: output };
	}
}
