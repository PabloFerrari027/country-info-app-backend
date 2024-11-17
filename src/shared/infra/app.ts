import 'reflect-metadata';
import express from 'express';
import env from '@shared/env';

export const app = express();

const port = env.PORT;

export const server = app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log('Server listening on port ' + port);
});
