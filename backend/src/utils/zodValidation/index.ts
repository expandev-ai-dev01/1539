import { z } from 'zod';

export const zString = z.string().min(1);

export const zNullableString = (maxLength?: number) => {
  let schema = z.string();
  if (maxLength) {
    schema = schema.max(maxLength);
  }
  return schema.nullable();
};

export const zName = z.string().min(1).max(200);

export const zNullableDescription = z.string().max(500).nullable();

export const zFK = z.number().int().positive();

export const zNullableFK = z.number().int().positive().nullable();

export const zBit = z.union([z.literal(0), z.literal(1)]);

export const zDateString = z
  .string()
  .refine((val) => !isNaN(Date.parse(val)), { message: 'Invalid date format' });

export const zEmail = z.string().email();

export const zPassword = z.string().min(8).max(100);
