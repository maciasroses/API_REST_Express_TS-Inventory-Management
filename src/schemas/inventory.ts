import z from "zod";
import validateSchema from "../utils/validate-schema";
import {
  EMPTY_STRING,
  INVALID_DATE,
  NEGATIVE_NUMBER,
  UUID_INVALID_MESSAGE,
} from "../constants";

const transferSchema = z.object({
  productId: z.string().uuid({
    message: `productId ID ${EMPTY_STRING} and ${UUID_INVALID_MESSAGE}`,
  }),
  sourceStoreId: z.string().uuid({
    message: `productId ID ${EMPTY_STRING} and ${UUID_INVALID_MESSAGE}`,
  }),
  targetStoreId: z.string().uuid({
    message: `productId ID ${EMPTY_STRING} and ${UUID_INVALID_MESSAGE}`,
  }),
  quantity: z.number().min(0, {
    message: `Quantity ${NEGATIVE_NUMBER}`,
  }),
  timestamp: z
    .string()
    .refine((val) => !isNaN(Date.parse(val)), {
      message: `Timestamp ${INVALID_DATE}`,
    })
    .transform((val) => new Date(val)),
});

const schemas = {
  transfer: transferSchema,
};

export default function validateInventorySchema(action: string, data: unknown) {
  return validateSchema(schemas, action, data);
}
