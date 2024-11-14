"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const tsyringe_1 = require("tsyringe");
const process_1 = require("process");
const response_time_listener_1 = require("./https/middlewares/response-time-listener");
const custom_express_response_1 = require("./https/middlewares/custom-express-response");
const routes_1 = require("./https/routes");
const make_all_repositories_1 = require("../factories/make-all-repositories");
exports.app = (0, express_1.default)();
const responseTimeListener = tsyringe_1.container.resolve(response_time_listener_1.ResponseTimeListener);
const customExpressResponse = tsyringe_1.container.resolve(custom_express_response_1.CustomExpressResponse);
const cors = (0, cors_1.default)({
    origin: process_1.env.FRONTEND_URL,
});
exports.app.use(customExpressResponse.execute);
exports.app.use(responseTimeListener.execute);
exports.app.use(express_1.default.json());
exports.app.use(express_1.default.urlencoded({ extended: false }));
exports.app.use(cors);
exports.app.use(routes_1.routes);
make_all_repositories_1.MakeAllRepositories.execute({ type: 'PRODUCTION' });
