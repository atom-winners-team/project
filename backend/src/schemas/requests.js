import { z } from 'zod';

export const createRequestSchema = z.object({
    id: z.string().uuid().nullable().optional(),

    equipment_id: z.string().uuid().nullable().optional(),

    type: z.enum([
        'inspection',
        'repair',
    ]),

    status: z.enum([
        'new',
        'in_progress',
        'waiting_parts',
        'done',
        'rejected',
    ]).default('new'),

    priority_id: z.number()
        .int()
        .min(-2147483648)
        .max(2147483647)
        .nullable()
        .optional(),

    description: z.string().nullable().optional(),

    author_id: z.number()
        .int()
        .min(-2147483648)
        .max(2147483647)
        .nullable()
        .optional(),

    assignee_id: z.number()
        .int()
        .min(-2147483648)
        .max(2147483647)
        .nullable()
        .optional(),

    planned_at: z.iso.datetime({ offset: true })
        .nullable()
        .optional(),

    snapshot_context: z.json().nullable().optional(),
}).strict();