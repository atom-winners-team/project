import { z } from 'zod';

export const loginBodySchema = z.object({
    login: z.string().trim().min(1).max(255),
    password: z.string().min(1).max(1024),
}).strict();
