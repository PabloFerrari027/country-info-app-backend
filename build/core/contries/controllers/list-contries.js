"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ListCountries = void 0;
const tsyringe_1 = require("tsyringe");
const zod_1 = require("zod");
const controller_1 = require("../../../shared/agreements/controller");
let ListCountries = class ListCountries extends controller_1.Controller {
    constructor(listCountriesService) {
        super();
        this.listCountriesService = listCountriesService;
    }
    async execute(input) {
        try {
            const querySchema = zod_1.z.object({
                name: zod_1.z.coerce.boolean().optional(),
                code: zod_1.z.coerce.boolean().optional(),
                'image.name': zod_1.z.coerce.boolean().optional(),
                'image.flag': zod_1.z.coerce.boolean().optional(),
                'image.iso2': zod_1.z.coerce.boolean().optional(),
                'image.iso3': zod_1.z.coerce.boolean().optional(),
                'population.year': zod_1.z.coerce.boolean().optional(),
                'population.value': zod_1.z.coerce.boolean().optional(),
                'borders.commonName': zod_1.z.coerce.boolean().optional(),
                'borders.officialName': zod_1.z.coerce.boolean().optional(),
                'borders.countryCode': zod_1.z.coerce.boolean().optional(),
                'borders.region': zod_1.z.coerce.boolean().optional(),
                'borders.borders': zod_1.z.coerce.boolean().optional(),
            });
            const queryParsedResponse = await querySchema.safeParseAsync(input.query);
            if (!queryParsedResponse.success || !queryParsedResponse.data) {
                const errors = queryParsedResponse.error?.issues.map(err => ({
                    path: err.path,
                    message: err.message,
                })) ?? [];
                const output = {
                    status: 400,
                    data: { errors },
                };
                return output;
            }
            const queryData = queryParsedResponse.data;
            const fields = {};
            if (Object.values(queryData).length === 0) {
                queryData.name = true;
                queryData.code = true;
                queryData['image.name'] = true;
                queryData['image.flag'] = true;
                queryData['image.iso2'] = true;
                queryData['image.iso3'] = true;
                queryData['population.year'] = true;
                queryData['population.value'] = true;
                queryData['borders.commonName'] = true;
                queryData['borders.officialName'] = true;
                queryData['borders.countryCode'] = true;
                queryData['borders.region'] = true;
                queryData['borders.borders'] = true;
            }
            Object.entries(queryData).forEach(([item, value]) => {
                const keys = item.split('.');
                let current = fields;
                for (let i = 0; i < keys.length - 1; i++) {
                    if (typeof current[keys[i]] === 'boolean')
                        current[keys[i]] = {};
                    if (!current[keys[i]])
                        current[keys[i]] = {};
                    current = current[keys[i]];
                }
                current[keys[keys.length - 1]] = value;
            });
            const { data: countries } = await this.listCountriesService.execute({
                fields,
            });
            const data = countries.reduce((acc, item) => {
                const result = this.filterProps(item.toJSON(), fields);
                if (Object.values(result).length > 0)
                    acc.push(result);
                return acc;
            }, []);
            const output = {
                data,
                status: 200,
            };
            return output;
        }
        catch (error) {
            const output = {
                status: 500,
                data: {
                    errors: [`Internal server error`],
                },
            };
            return output;
        }
    }
};
exports.ListCountries = ListCountries;
exports.ListCountries = ListCountries = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)('ListCountriesService')),
    __metadata("design:paramtypes", [Object])
], ListCountries);
