import { app } from './app';
import env from '@shared/env';

const port = env.PORT;

export const server = app.listen(port, () => {
	// eslint-disable-next-line no-console
	console.log('Server listening on port ' + port);
});
