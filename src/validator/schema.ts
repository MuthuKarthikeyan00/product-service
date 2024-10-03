import { z } from 'zod';


export const productValidationSchema = z.object({
  type_id: z.number().int().positive(),
  name: z.string(),
  hsn_code: z.number().int().positive().nullable().optional(),
  sac_code: z.number().int().positive().nullable().optional(),
  price: z.number().positive(),
  tax: z.number().int().min(0).max(1),
  tax_rate: z.number().int().min(0).nullable().optional(),
  description: z.string().nullable().optional(),
  category_ids: z.array(z.number().int().positive()).nullable().optional(),
  attributes: z.any().nullable().optional(),
  parent_id: z.number().int().positive().nullable().optional(),
  children: z.array(z.number().int().positive()).nullable().optional(),
  unit_of_measurement: z.number().int().positive().nullable().optional(),
  weight: z.number().positive().nullable().optional(),
  length: z.number().positive().nullable().optional(),
  height: z.number().positive().nullable().optional(),
  width: z.number().positive().nullable().optional(),
});

export const attributeValidationSchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
});

export const categoryValidationSchema = z.object({
  name: z.string(),
  parent_id: z.number().int().positive().nullable().optional(),
  description: z.string().nullable().optional(),
});

export const productTypeValidationSchema = z.object({
  name: z.string(),
  description: z.string().nullable().optional(),
});

export const unitOfMeasurementValidationSchema = z.object({
  name: z.string(),
  code: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
});


export type ZodProductParams = z.infer<typeof productValidationSchema>; // string