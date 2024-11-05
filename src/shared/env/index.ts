import { z } from 'zod';

const schema = z.object({
	FRONTEND_URL: z.string(),
});

const result = schema.safeParse(process.env);

if (!result.success) throw new Error(result.error.message);

export default result.data;
