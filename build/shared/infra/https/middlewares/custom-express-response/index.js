"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomExpressResponse = void 0;
class CustomExpressResponse {
    execute(req, res, next) {
        const originalSend = res.send;
        const originalJson = res.json;
        const originalStatus = res.status;
        res.send = function (body) {
            if (!res.headersSent)
                return originalSend.call(this, body);
            return this;
        };
        res.json = function (body) {
            if (!res.headersSent)
                return originalJson.call(this, body);
            return this;
        };
        res.status = function (code) {
            if (!res.headersSent)
                return originalStatus.call(this, code);
            return this;
        };
        next();
    }
}
exports.CustomExpressResponse = CustomExpressResponse;
