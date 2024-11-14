"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MakeCountriesRepository = void 0;
const tsyringe_1 = require("tsyringe");
const API_contries_repository_1 = require("../implementations/API-contries-repository");
class MakeCountriesRepository {
    static execute(params) {
        switch (params.type) {
            case 'IN MEMORY': {
                this.repository = tsyringe_1.container.resolve(API_contries_repository_1.APICountriesRepository);
                tsyringe_1.container.registerInstance(this.key, this.repository);
                return this.repository;
            }
            case 'PRODUCTION': {
                this.repository = tsyringe_1.container.resolve(API_contries_repository_1.APICountriesRepository);
                tsyringe_1.container.registerInstance(this.key, this.repository);
                return this.repository;
            }
            default: {
                throw new Error('Invalid type');
            }
        }
    }
}
exports.MakeCountriesRepository = MakeCountriesRepository;
MakeCountriesRepository.key = 'CountriesRepository';
