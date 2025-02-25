import z from "zod";
import validateSchema from "../utils/validate-schema";
import { EMPTY_STRING, MAX_LENGTH, NEGATIVE_NUMBER } from "../constants";

const baseSchema = z.object({
  name: z
    .string()
    .min(1, {
      message: `Name ${EMPTY_STRING}`,
    })
    .max(255, {
      message: `Name ${MAX_LENGTH}`,
    }),
  description: z.string().min(1, {
    message: `Description ${EMPTY_STRING}`,
  }),
  category: z
    .string()
    .min(1, {
      message: `Category ${EMPTY_STRING}`,
    })
    .max(255, {
      message: `Category ${MAX_LENGTH}`,
    }),
  price: z.number().min(0, {
    message: `Price ${NEGATIVE_NUMBER}`,
  }),
  sku: z
    .string()
    .min(1, {
      message: `SKU ${EMPTY_STRING}`,
    })
    .max(255, {
      message: `SKU ${MAX_LENGTH}`,
    }),
});

const createNUpdateSchema = baseSchema.extend({
  storeId: z.string().uuid({
    message: `Store ID ${EMPTY_STRING} and must be a valid UUID`,
  }),
  quantity: z.number().min(0, {
    message: `Quantity ${NEGATIVE_NUMBER}`,
  }),
  minStock: z.number().min(0, {
    message: `Min Stock ${NEGATIVE_NUMBER}`,
  }),
});

const schemas = {
  create: createNUpdateSchema,
  update: createNUpdateSchema,
};

export default function validateProductSchema(action: string, data: unknown) {
  return validateSchema(schemas, action, data);
}
