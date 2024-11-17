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
    toJSON() {
        const output = {
            countryCode: this.props.countryCode,
            commonName: this.props.commonName,
            officialName: this.props.officialName,
            region: this.props.region,
            borders: this.props.borders.map(border => border.toJSON()),
        };
        return output;
    }
    static create(props) {
        const countryBorder = new CountryBorder(props);
        return countryBorder;
    }
}
exports.CountryBorder = CountryBorder;
