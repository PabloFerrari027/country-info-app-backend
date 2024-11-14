"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Country = void 0;
class Country {
    constructor(props) {
        this.props = props;
    }
    get commonName() {
        return this.props.commonName;
    }
    get officialName() {
        return this.props.officialName;
    }
    get countryCode() {
        return this.props.countryCode;
    }
    get region() {
        return this.props.region;
    }
    get image() {
        return this.props.image;
    }
    get country() {
        return this.props.country;
    }
    get code() {
        return this.props.code;
    }
    get iso3() {
        return this.props.iso3;
    }
    get populationCounts() {
        return this.props.populationCounts;
    }
    get borders() {
        return this.props.borders;
    }
    toJSON() {
        const code = this.code;
        const commonName = this.commonName;
        const country = this.country;
        const countryCode = this.countryCode;
        const iso3 = this.iso3;
        const officialName = this.officialName;
        const region = this.region;
        const borders = this.borders.map(bordder => bordder.toJSON());
        const image = this.image.toJSON();
        const populationCounts = this.populationCounts.map(populationCount => populationCount.toJSON());
        const output = {
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
    static create(props) {
        const country = new Country(props);
        return country;
    }
}
exports.Country = Country;
