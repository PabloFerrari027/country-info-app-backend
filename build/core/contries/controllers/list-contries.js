"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCountries = void 0;
const tsyringe_1 = require("tsyringe");
const list_countries_1 = require("../services/list-countries");
let ListCountries = class ListCountries {
    async execute(req, res) {
        try {
            const findCountryByName = tsyringe_1.container.resolve(list_countries_1.ListCountries);
            const { data } = await findCountryByName.execute({ name });
            const output = data.map(country => country.toJSON());
            res.json(output).status(200).end();
        }
        catch (error) {
            const output = {
                errors: [`Internal server error`],
            };
            res.json(output).status(404).end();
        }
    }
};
exports.ListCountries = ListCountries;
exports.ListCountries = ListCountries = __decorate([
    (0, tsyringe_1.injectable)()
], ListCountries);
