"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.APICountriesRepository = void 0;
const country_1 = require("../entities/country");
const tsyringe_1 = require("tsyringe");
const country_image_1 = require("../entities/value-objects/country-image");
const country_border_1 = require("../entities/value-objects/country-border");
const country_population_1 = require("../entities/value-objects/country-population");
let APICountriesRepository = class APICountriesRepository {
    constructor(cacheProvider) {
        this.cacheProvider = cacheProvider;
    }
    async findByCode(code) {
        const cache = await this.cacheProvider.findById(code);
        const currentDate = new Date().getTime();
        const cacheIsValid = cache && currentDate < cache.expiresIn;
        if (cacheIsValid) {
            const handleBorder = (border) => {
                return country_border_1.CountryBorder.create({
                    borders: border.borders.map(border => handleBorder(border)),
                    commonName: border.commonName,
                    countryCode: border.countryCode,
                    officialName: border.officialName,
                    region: border.region,
                });
            };
            const borders = cache.borders.map(border => handleBorder(border));
            const population = cache.population.map(population => country_population_1.CountryPopulation.create({
                value: population.value,
                year: population.year,
            }));
            const image = cache.image
                ? country_image_1.CountryImage.create({
                    flag: cache.image.flag,
                    iso2: cache.image.iso2,
                    iso3: cache.image.iso3,
                    name: cache.image.name,
                })
                : null;
            const country = country_1.Country.create({
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
        const countries = await responses[0].json();
        const images = await responses[1].json();
        const population = await responses[2].json();
        const borders = await Promise.all(countries.map(async (country) => {
            const response = await fetch(`https://date.nager.at/api/v3/CountryInfo/${country.countryCode}`);
            return await response.json();
        }));
        const found = countries.find(country => country.countryCode === code);
        if (!found)
            return null;
        const handleBorder = (border) => {
            const borders = border.borders?.map(border => handleBorder(border)) ?? [];
            const countryCode = border.countryCode;
            const officialName = border.officialName;
            const region = border.region;
            return country_border_1.CountryBorder.create({
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
        const _image = images.data.find(img => img.iso2 === code || img.iso3 === code || img.name === name);
        let image = null;
        if (_image) {
            image = country_image_1.CountryImage.create({
                flag: _image.flag ?? '',
                iso2: _image.iso2,
                iso3: _image.iso3,
                name: _image.name,
            });
        }
        const _population = population.data
            .filter(population => population.country === found.name)
            .reduce((acc, item) => {
            const population = item.populationCounts.map(count => country_population_1.CountryPopulation.create({ value: count.value, year: count.year }));
            acc.push(...population);
            return acc;
        }, []);
        const country = country_1.Country.create({
            code,
            name,
            borders: _borders,
            image,
            population: _population,
        });
        const json = country.toJSON();
        const date = new Date();
        date.setHours(date.getHours() + 1);
        const expiresIn = date.getTime();
        await this.cacheProvider.save({ id: json.code, expiresIn, ...json });
        return country;
    }
    async list() {
        const listingCache = await this.cacheProvider.findById('list-countries');
        const currentDate = new Date().getTime();
        const listingCacheIsValid = listingCache && currentDate < listingCache.expiresIn;
        const listCountriesByCache = async (ids) => {
            const countries = [];
            const handleBorder = (border) => {
                return country_border_1.CountryBorder.create({
                    borders: border.borders.map(border => handleBorder(border)),
                    commonName: border.commonName,
                    countryCode: border.countryCode,
                    officialName: border.officialName,
                    region: border.region,
                });
            };
            for (const id of ids) {
                const cache = await this.cacheProvider.findById(id);
                const currentDate = new Date().getTime();
                const cacheIsValid = cache && currentDate < cache.expiresIn;
                if (!cacheIsValid)
                    return [];
                const borders = cache.borders.map(border => handleBorder(border));
                const population = cache.population.map(population => country_population_1.CountryPopulation.create({
                    value: population.value,
                    year: population.year,
                }));
                const image = cache.image
                    ? country_image_1.CountryImage.create({
                        flag: cache.image.flag,
                        iso2: cache.image.iso2,
                        iso3: cache.image.iso3,
                        name: cache.image.name,
                    })
                    : null;
                const country = country_1.Country.create({
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
            if (countries.length > 0)
                return output;
        }
        const responses = await Promise.all([
            fetch('https://date.nager.at/api/v3/AvailableCountries'),
            fetch('https://countriesnow.space/api/v0.1/countries/flag/images'),
            fetch('https://countriesnow.space/api/v0.1/countries/population'),
        ]);
        const countries = await responses[0].json();
        const images = await responses[1].json();
        const population = await responses[2].json();
        const borders = await Promise.all(countries.map(async (country) => {
            const response = await fetch(`https://date.nager.at/api/v3/CountryInfo/${country.countryCode}`);
            return await response.json();
        }));
        const handleBorder = (border) => {
            const borders = border.borders?.map(border => handleBorder(border)) ?? [];
            const countryCode = border.countryCode;
            const officialName = border.officialName;
            const region = border.region;
            return country_border_1.CountryBorder.create({
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
            const _image = images.data.find(img => img.iso2 === code || img.iso3 === code || img.name === name);
            let image = null;
            if (_image) {
                image = country_image_1.CountryImage.create({
                    flag: _image.flag ?? '',
                    iso2: _image.iso2,
                    iso3: _image.iso3,
                    name: _image.name,
                });
            }
            const _population = population.data
                .filter(population => population.country === item.name)
                .reduce((acc, item) => {
                const population = item.populationCounts.map(count => country_population_1.CountryPopulation.create({ value: count.value, year: count.year }));
                acc.push(...population);
                return acc;
            }, []);
            return country_1.Country.create({
                code,
                name,
                borders: _borders,
                image,
                population: _population,
            });
        });
        const date = new Date();
        date.setHours(date.getHours() + 1);
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
};
exports.APICountriesRepository = APICountriesRepository;
exports.APICountriesRepository = APICountriesRepository = __decorate([
    (0, tsyringe_1.singleton)(),
    __param(0, (0, tsyringe_1.inject)('CacheProvider')),
    __metadata("design:paramtypes", [Object])
], APICountriesRepository);
