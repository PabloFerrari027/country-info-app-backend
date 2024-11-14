"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseTimeListener = void 0;
class ResponseTimeListener {
    execute(req, res, next) {
        const timeout = 60 * 1000;
        const timer = setTimeout(() => {
            const message = 'Exceeded response time';
            res.status(503).send(message);
        }, timeout);
        res.on('finish', () => {
            clearTimeout(timer);
        });
        next();
    }
}
exports.ResponseTimeListener = ResponseTimeListener;
