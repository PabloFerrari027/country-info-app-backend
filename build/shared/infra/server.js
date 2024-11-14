"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = void 0;
const app_1 = require("./app");
const env_1 = __importDefault(require("../env"));
const port = env_1.default.PORT;
exports.server = app_1.app.listen(port, () => {
    console.log('server listening on port ' + port);
});
