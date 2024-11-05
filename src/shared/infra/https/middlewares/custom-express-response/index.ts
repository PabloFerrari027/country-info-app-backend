/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from 'express';

export class CustomExpressResponse {
	execute(req: Request, res: Response, next: NextFunction): void {
		const originalSend = res.send;
		const originalJson = res.json;
		const originalStatus = res.status;

		res.send = function (body?: any): Response {
			if (!res.headersSent) return originalSend.call(this, body);
			return this;
		};

		res.json = function (body?: any): Response {
			if (!res.headersSent) return originalJson.call(this, body);
			return this;
		};

		res.status = function (code: number): Response {
			if (!res.headersSent) return originalStatus.call(this, code);
			return this;
		};

		next();
	}
}
