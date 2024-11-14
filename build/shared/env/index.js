"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const schema = zod_1.z.object({
    FRONTEND_URL: zod_1.z.string(),
    PORT: zod_1.z.coerce.number(),
});
const result = schema.safeParse(process.env);
if (!result.success)
    throw new Error(result.error.message);
exports.default = result.data;
