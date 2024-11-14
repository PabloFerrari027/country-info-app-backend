"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryPopulation = void 0;
class CountryPopulation {
    constructor(props) {
        this.props = props;
    }
    get year() {
        return this.props.year;
    }
    get value() {
        return this.props.value;
    }
    toJSON() {
        const output = {
            value: this.props.value,
            year: this.props.year,
        };
        return output;
    }
    static create(props) {
        const countryPopulation = new CountryPopulation(props);
        return countryPopulation;
    }
}
exports.CountryPopulation = CountryPopulation;
