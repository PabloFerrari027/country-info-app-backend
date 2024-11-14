import { z } from 'zod';
import 'dotenv/config';

const schema = z.object({
	FRONTEND_URL: z.string(),
	PORT: z.coerce.number(),
});

const result = schema.safeParse(process.env);

if (!result.success) throw new Error(result.error.message);

export default result.data;
