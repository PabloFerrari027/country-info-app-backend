import 'reflect-metadata';
import { MakeAllRepositories } from '@shared/factories/make-all-repositories';
import { app } from './app';
import env from '@shared/env';

const port = env.PORT;

MakeAllRepositories.execute({ type: 'PRODUCTION' });

export const server = app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log('server listening on port ' + port);
});
