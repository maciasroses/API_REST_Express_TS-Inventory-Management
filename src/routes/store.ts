import { Router } from "express";
import StoreController from "../controllers/store";
import type { IStoreModel, IInventoryModel } from "../interfaces";

/**
 * @swagger
 * tags:
 *   name: Stores
 *   description: API to manage stores
 */

/**
 * @swagger
 * /stores/{id}/inventory:
 *   get:
 *     summary: Get inventory by store ID
 *     description: Retrieves the inventory for a specific store from the cache if available, otherwise fetches from the database.
 *     tags: [Stores]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: The unique identifier of the store.
 *         schema:
 *           type: string
 *           format: uuid
 *           example: "123e4567-e89b-12d3-a456-426614174000"
 *     responses:
 *       200:
 *         description: Inventory retrieved successfully
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
 *                       id:
 *                         type: string
 *                         format: uuid
 *                         example: "2c6d48ab-b4d1-4a2f-8fc3-6bc36a597693"
 *                       productId:
 *                         type: string
 *                         format: uuid
 *                         example: "6ba7b810-9dad-11d1-80b4-00c04fd430c8"
 *                       product:
 *                         type: string
 *                         example: "Gaming Laptop"
 *                       quantity:
 *                         type: number
 *                         example: 9
 *                       minStock:
 *                         type: number
 *                         example: 2
 *                 pagination:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: object
 *                   example: {}
 *       400:
 *         description: Invalid store ID
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
 *                   example: "Invalid UUID format"
 *                 data:
 *                   type: object
 *                   example: {}
 *                 pagination:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: object
 *                   example: {}
 *       404:
 *         description: Store not found
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
 *                   example: "Store not found"
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

const StoreRouter = ({
  storeModel,
  inventoryModel,
}: {
  storeModel: IStoreModel;
  inventoryModel: IInventoryModel;
}) => {
  const storeRouter = Router();

  const storeController = new StoreController({ storeModel, inventoryModel });

  storeRouter.get("/:id/inventory", storeController.getInventoryByStoreId);

  return storeRouter;
};

export default StoreRouter;
