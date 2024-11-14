"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTrue = void 0;
class isTrue {
    static execute(input) {
        return !!input.filter(item => !!item);
    }
}
exports.isTrue = isTrue;
