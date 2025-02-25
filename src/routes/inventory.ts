import { Router } from "express";
import InventoryController from "../controllers/inventory";
import type {
  IStoreModel,
  IProductModel,
  IInventoryModel,
} from "../interfaces";

/**
 * @swagger
 * tags:
 *   name: Inventory
 *   description: API to manage inventory
 */

/**
 * @swagger
 * /inventory/transfer:
 *   post:
 *     summary: Transfer a product from one store to another
 *     description: Transfers a product from the source store to the target store with the specified quantity.
 *     tags: [Inventory]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - productId
 *               - sourceStoreId
 *               - targetStoreId
 *               - quantity
 *               - timestamp
 *             properties:
 *               productId:
 *                 type: string
 *                 format: uuid
 *                 example: "bb7cfc89-4137-4823-a1a2-65a3f5c4573e"
 *               sourceStoreId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               targetStoreId:
 *                 type: string
 *                 format: uuid
 *                 example: "123e4567-e89b-12d3-a456-426614174001"
 *               quantity:
 *                 type: number
 *                 example: 10
 *               timestamp:
 *                 type: string
 *                 format: date-time
 *     responses:
 *       200:
 *         description: Product transferred successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Product transferred successfully"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 pagination:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: object
 *                   example: {}
 *       400:
 *         description: Invalid request
 *         content:
 *           application/json:
 *             schema:
 *               oneOf:
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "error"
 *                     message:
 *                       type: string
 *                       example: "Validation errors"
 *                     data:
 *                       type: object
 *                       example: {}
 *                     pagination:
 *                       type: object
 *                       example: {}
 *                     errors:
 *                       type: object
 *                       example: {}
 *                 - type: object
 *                   properties:
 *                     status:
 *                       type: string
 *                       example: "error"
 *                     message:
 *                       type: string
 *                       example: "Insufficient stock"
 *                     data:
 *                       type: object
 *                       example: {}
 *                     pagination:
 *                       type: object
 *                       example: {}
 *                     errors:
 *                       type: object
 *                       example: {}
 *       404:
 *         description: Product or Store not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Product not found"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 pagination:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: object
 *                   example: {}
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 pagination:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: object
 *                   example: {}
 */

/**
 * @swagger
 * /inventory/alerts:
 *   get:
 *     summary: Get low stock alerts
 *     description: Retrieves the low stock alerts from the cache if available, otherwise fetches from the database.
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: Low stock alerts retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: ""
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       storeId:
 *                         type: string
 *                         format: uuid
 *                         example: "a1b2c3d4-e56f-78a9-b012-345678901234"
 *                       productId:
 *                         type: string
 *                         format: uuid
 *                         example: "bb7cfc89-4137-4823-a1a2-65a3f5c4573e"
 *                       product:
 *                         type: string
 *                         example: "4K Monitor"
 *                       quantity:
 *                         type: number
 *                         example: 0
 *                       minStock:
 *                         type: number
 *                         example: 1
 *                 pagination:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: object
 *                   example: {}
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 pagination:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: object
 *                   example: {}
 */

const InventoryRouter = ({
  storeModel,
  productModel,
  inventoryModel,
}: {
  storeModel: IStoreModel;
  productModel: IProductModel;
  inventoryModel: IInventoryModel;
}) => {
  const inventoryRouter = Router();

  const inventoryController = new InventoryController({
    storeModel,
    productModel,
    inventoryModel,
  });

  inventoryRouter.get("/alerts", inventoryController.getLowStockAlerts);
  inventoryRouter.post("/transfer", inventoryController.transferProduct);

  return inventoryRouter;
};

export default InventoryRouter;
