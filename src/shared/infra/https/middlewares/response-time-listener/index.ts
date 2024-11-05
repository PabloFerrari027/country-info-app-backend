import { NextFunction, Request, Response } from 'express';

export class ResponseTimeListener {
	execute(req: Request, res: Response, next: NextFunction): void {
		const timeout = 60 * 1000; // 1m

		const timer = setTimeout(() => {
			const message = 'Exceeded response time';
			res.status(503).send(message);
			return;
		}, timeout);

		res.on('finish', () => clearTimeout(timer));

		next();
	}
}
