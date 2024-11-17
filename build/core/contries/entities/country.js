"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Country = void 0;
class Country {
    constructor(props) {
        this.props = props;
    }
    get image() {
        return this.props.image;
    }
    get name() {
        return this.props.name;
    }
    get code() {
        return this.props.code;
    }
    get population() {
        return this.props.population;
    }
    get borders() {
        return this.props.borders;
    }
    toJSON() {
        const code = this.code;
        const name = this.name;
        const borders = this.borders.map(bordder => bordder.toJSON());
        const image = this.image?.toJSON() ?? null;
        const population = this.population.map(population => population.toJSON());
        const output = {
            name,
            code,
            image,
            population,
            borders,
        };
        return output;
    }
    static create(props) {
        const country = new Country(props);
        return country;
    }
}
exports.Country = Country;
