"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryBorder = void 0;
class CountryBorder {
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
    get borders() {
        return this.props.borders;
    }
    toJSON() {
        const output = {
            borders: this.props.borders,
            commonName: this.props.commonName,
            countryCode: this.props.countryCode,
            officialName: this.props.officialName,
            region: this.props.region,
        };
        return output;
    }
    static create(props) {
        const countryBorder = new CountryBorder(props);
        return countryBorder;
    }
}
exports.CountryBorder = CountryBorder;
