import redis from "../config/redisClient";
import { Request, Response } from "express";
import sendResponse from "../utils/send-response";
import validateUuid from "../utils/uuid-validator";
import {
  NOT_FOUND,
  STATUS_ERROR,
  UUID_INVALID,
  INTERNAL_SERVER_ERROR,
} from "../constants";
import type { IInventoryModel, IStoreModel } from "../interfaces";

export default class StoreController {
  private storeModel: IStoreModel;
  private inventoryModel: IInventoryModel;

  constructor({
    storeModel,
    inventoryModel,
  }: {
    storeModel: IStoreModel;
    inventoryModel: IInventoryModel;
  }) {
    this.storeModel = storeModel;
    this.inventoryModel = inventoryModel;
  }

  getInventoryByStoreId = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!validateUuid(id)) {
        sendResponse(res, 400, {
          status: STATUS_ERROR,
          message: UUID_INVALID,
        });
        return;
      }

      const existingStore = await this.storeModel.getStoreById(id);
      if (!existingStore) {
        sendResponse(res, 404, {
          status: STATUS_ERROR,
          message: `Store ${NOT_FOUND}`,
        });
        return;
      }

      const cacheKey = `inventory:${id}`;

      const cachedInventory = await redis.get(cacheKey);
      if (cachedInventory) {
        console.log("StoreController.getInventoryByStoreId: Data from cache");
        sendResponse(res, 200, { data: JSON.parse(cachedInventory) });
        return;
      }

      const inventory = await this.inventoryModel.getInventoryByStoreId(id);

      await redis.setex(cacheKey, 600, JSON.stringify(inventory));

      console.log("StoreController.getInventoryByStoreId: Data from database");
      sendResponse(res, 200, { data: inventory });
    } catch (error) {
      console.error("StoreController.getInventoryByStoreId:", error);
      sendResponse(res, 500, {
        status: STATUS_ERROR,
        message: INTERNAL_SERVER_ERROR,
      });
    }
  };
}
