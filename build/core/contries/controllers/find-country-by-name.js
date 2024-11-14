"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FindCountryByName = void 0;
const tsyringe_1 = require("tsyringe");
const find_country_by_name_1 = require("../services/find-country-by-name");
const zod_1 = require("zod");
const isTrue_1 = require("../../../shared/utils/isTrue");
let FindCountryByName = class FindCountryByName {
    async execute(req, res) {
        try {
            const schema = zod_1.z.object({
                name: zod_1.z.string(),
            });
            const parsedResponse = await schema.safeParseAsync(req.params);
            const success = isTrue_1.isTrue.execute([
                !!parsedResponse.success,
                !!parsedResponse.data,
            ]);
            if (!success) {
                const errors = parsedResponse.error?.issues.map(err => ({
                    path: err.path,
                    message: err.message,
                }));
                const output = {
                    errors,
                };
                res.json(output).status(400).end();
                return;
            }
            const data = parsedResponse.data;
            const { name } = data;
            const findCountryByName = tsyringe_1.container.resolve(find_country_by_name_1.FindCountryByName);
            const { country } = await findCountryByName.execute({ name });
            if (!country) {
                const output = {
                    errors: [`Resource not found`],
                };
                res.json(output).status(404).end();
                return;
            }
            const output = country.toJSON();
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
exports.FindCountryByName = FindCountryByName;
exports.FindCountryByName = FindCountryByName = __decorate([
    (0, tsyringe_1.injectable)()
], FindCountryByName);
