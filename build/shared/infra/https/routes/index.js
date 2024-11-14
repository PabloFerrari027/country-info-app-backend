"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.routes = void 0;
const countries_routes_1 = require("../../../../core/contries/routes/countries.routes");
const express_1 = require("express");
exports.routes = (0, express_1.Router)();
exports.routes.use('/countries', countries_routes_1.contriesRoutes);
