"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeAllRepositories = void 0;
const make_countries_repository_1 = require("../../core/contries/factories/make-countries-repository");
class MakeAllRepositories {
    static execute(params) {
        this._repositories = {
            CountriesRepository: make_countries_repository_1.MakeCountriesRepository.execute({
                type: params.type,
            }),
        };
    }
    static get repositories() {
        return this._repositories;
    }
}
exports.MakeAllRepositories = MakeAllRepositories;
