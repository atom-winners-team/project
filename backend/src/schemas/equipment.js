import { z } from 'zod';

export const createEquipmentBodySchema = z.object({
    id: z.string().max(255).nullable().optional(),

    external_id: z.string().max(255).nullable().optional(),

    parent_id: z.string().uuid().nullable().optional(),

    name: z.string().max(255).nullable().optional(),

    equipment_type: z.string().max(255).nullable().optional(),

    level_name: z.string().max(255).nullable().optional(),

    commissioned_at: z.iso.date().nullable().optional(),

    manufactured_at: z.iso.date().nullable().optional(),

    usage_life_months: z.number()
        .int()
        .min(-2147483648)
        .max(2147483647)
        .nullable()
        .optional(),

    inventory_number: z.string().max(255).nullable().optional(),

    telemetry_key: z.string().max(255).nullable().optional(),
}).strict();