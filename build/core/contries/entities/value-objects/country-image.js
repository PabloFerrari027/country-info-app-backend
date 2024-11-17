"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryImage = void 0;
class CountryImage {
    constructor(props) {
        this.props = props;
    }
    get name() {
        return this.props.name;
    }
    get flag() {
        return this.props.flag;
    }
    get iso2() {
        return this.props.iso2;
    }
    get iso3() {
        return this.props.iso3;
    }
    toJSON() {
        const output = {
            name: this.props.name,
            flag: this.props.flag,
            iso2: this.props.iso2,
            iso3: this.props.iso3,
        };
        return output;
    }
    static create(props) {
        const countryImage = new CountryImage(props);
        return countryImage;
    }
}
exports.CountryImage = CountryImage;
