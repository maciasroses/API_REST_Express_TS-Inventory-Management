import redis from "../config/redisClient";
import { Request, Response } from "express";
import sendResponse from "../utils/send-response";
import validateInventorySchema from "../schemas/inventory";
import {
  NOT_FOUND,
  STATUS_ERROR,
  VALIDATION_ERROR,
  INTERNAL_SERVER_ERROR,
} from "../constants";
import type {
  IStoreModel,
  IProductModel,
  IInventoryModel,
} from "../interfaces";

export default class ProductController {
  private storeModel: IStoreModel;
  private productModel: IProductModel;
  private inventoryModel: IInventoryModel;

  constructor({
    storeModel,
    productModel,
    inventoryModel,
  }: {
    storeModel: IStoreModel;
    productModel: IProductModel;
    inventoryModel: IInventoryModel;
  }) {
    this.storeModel = storeModel;
    this.productModel = productModel;
    this.inventoryModel = inventoryModel;
  }

  transferProduct = async (req: Request, res: Response) => {
    try {
      const data = req.body;
      const errors = validateInventorySchema("transfer", data);
      if (Object.keys(errors).length > 0) {
        sendResponse(res, 400, {
          errors,
          status: STATUS_ERROR,
          message: VALIDATION_ERROR,
        });
        return;
      }

      const existingProduct = await this.productModel.getProductById(
        data.productId
      );
      if (!existingProduct) {
        sendResponse(res, 404, {
          status: STATUS_ERROR,
          message: `Product ${NOT_FOUND}`,
        });
        return;
      }

      const existingSourceStore = await this.storeModel.getStoreById(
        data.sourceStoreId
      );
      if (!existingSourceStore) {
        sendResponse(res, 404, {
          status: STATUS_ERROR,
          message: `Source store ${NOT_FOUND}`,
        });
        return;
      }

      const existingTargetStore = await this.storeModel.getStoreById(
        data.targetStoreId
      );
      if (!existingTargetStore) {
        sendResponse(res, 404, {
          status: STATUS_ERROR,
          message: `Target store ${NOT_FOUND}`,
        });
        return;
      }

      const availableQuantity =
        await this.inventoryModel.getStockByProductIdNStoreId(
          data.productId,
          data.sourceStoreId
        );
      if (availableQuantity < data.quantity) {
        sendResponse(res, 400, {
          status: STATUS_ERROR,
          message: "Insufficient stock",
        });
        return;
      }

      await this.inventoryModel.transferProduct(data);

      await redis.del(`inventory:${data.sourceStoreId}`);
      await redis.del(`inventory:${data.targetStoreId}`);
      await redis.del("lowStockAlerts");

      sendResponse(res, 200, { message: "Product transferred successfully" });
    } catch (error) {
      console.error("ProductController.transferProduct:", error);
      sendResponse(res, 500, {
        status: STATUS_ERROR,
        message: INTERNAL_SERVER_ERROR,
      });
    }
  };

  getLowStockAlerts = async (_req: Request, res: Response) => {
    try {
      const cacheKey = "lowStockAlerts";

      const cachedAlerts = await redis.get(cacheKey);
      if (cachedAlerts) {
        console.log("ProductController.getLowStockAlerts: Data from cache");
        sendResponse(res, 200, { data: JSON.parse(cachedAlerts) });
        return;
      }

      const alerts = await this.inventoryModel.getLowStockAlerts();

      await redis.setex(cacheKey, 300, JSON.stringify(alerts));

      console.log("ProductController.getLowStockAlerts: Data from database");
      sendResponse(res, 200, { data: alerts });
    } catch (error) {
      console.error("ProductController.getLowStockAlerts:", error);
      sendResponse(res, 500, {
        status: STATUS_ERROR,
        message: INTERNAL_SERVER_ERROR,
      });
    }
  };
}
