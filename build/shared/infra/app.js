"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
require("reflect-metadata");
const express_1 = __importDefault(require("express"));
const env_1 = __importDefault(require("../env"));
exports.app = (0, express_1.default)();
const port = env_1.default.PORT;
exports.server = exports.app.listen(port, () => {
    console.log('Server listening on port ' + port);
});
