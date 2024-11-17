"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContriesRoutes = void 0;
const express_1 = require("express");
const tsyringe_1 = require("tsyringe");
const list_contries_1 = require("../controllers/list-contries");
const find_country_by_code_1 = require("../controllers/find-country-by-code");
class ContriesRoutes {
    static execute() {
        const listCountries = tsyringe_1.container.resolve(list_contries_1.ListCountries);
        const findCountryByCode = tsyringe_1.container.resolve(find_country_by_code_1.FindCountryByCode);
        this.router.get('/countries/list', async (req, res) => {
            const body = req.body;
            const query = req.query;
            const params = req.params;
            const response = await listCountries.execute({
                body,
                params,
                query,
            });
            res.status(response.status).json(response.data).end();
        });
        this.router.get('/countries/find/by/code/:code', async (req, res) => {
            const body = req.body;
            const query = req.query;
            const params = req.params;
            const response = await findCountryByCode.execute({
                body,
                params,
                query,
            });
            res.status(response.status).json(response.data).end();
        });
    }
}
exports.ContriesRoutes = ContriesRoutes;
ContriesRoutes.router = (0, express_1.Router)();
