"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Routes = void 0;
const countries_routes_1 = require("../../../../core/contries/routes/countries.routes");
const express_1 = require("express");
class Routes {
    static execute() {
        countries_routes_1.ContriesRoutes.execute();
        this.router.use(countries_routes_1.ContriesRoutes.router);
    }
}
exports.Routes = Routes;
Routes.router = (0, express_1.Router)();
