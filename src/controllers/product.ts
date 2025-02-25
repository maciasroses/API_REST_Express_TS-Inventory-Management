import redis from "../config/redisClient";
import { Request, Response } from "express";
import sendResponse from "../utils/send-response";
import validateUuid from "../utils/uuid-validator";
import validateProductSchema from "../schemas/product";
import {
  NOT_FOUND,
  UUID_INVALID,
  STATUS_ERROR,
  VALIDATION_ERROR,
  INTERNAL_SERVER_ERROR,
} from "../constants";
import type { IProductModel, IStoreModel } from "../interfaces";

export default class ProductController {
  private storeModel: IStoreModel;
  private productModel: IProductModel;

  constructor({
    storeModel,
    productModel,
  }: {
    storeModel: IStoreModel;
    productModel: IProductModel;
  }) {
    this.storeModel = storeModel;
    this.productModel = productModel;
  }

  getAll = async (req: Request, res: Response) => {
    try {
      const filters = {
        category: req.query.category as string | undefined,
        minPrice: req.query.minPrice ? Number(req.query.minPrice) : undefined,
        maxPrice: req.query.maxPrice ? Number(req.query.maxPrice) : undefined,
        minStock: req.query.minStock ? Number(req.query.minStock) : undefined,
        maxStock: req.query.maxStock ? Number(req.query.maxStock) : undefined,
        page: req.query.page ? Number(req.query.page) : 1,
        limit: req.query.limit ? Number(req.query.limit) : 2,
      };

      const cacheKey = `products:${JSON.stringify(filters)}`;

      const cachedData = await redis.get(cacheKey);
      if (cachedData) {
        console.log("ProductController.getAll: Data from cache");
        sendResponse(res, 200, JSON.parse(cachedData));
        return;
      }

      const { data, pagination } = await this.productModel.getAllProducts(
        filters
      );

      await redis.setex(cacheKey, 60, JSON.stringify({ data, pagination }));

      console.log("ProductController.getAll: Data from database");
      sendResponse(res, 200, { data, pagination });
    } catch (error) {
      console.error("ProductController.getAll:", error);
      sendResponse(res, 500, {
        status: STATUS_ERROR,
        message: INTERNAL_SERVER_ERROR,
      });
    }
  };

  getById = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!validateUuid(id)) {
        sendResponse(res, 400, {
          status: STATUS_ERROR,
          message: UUID_INVALID,
        });
        return;
      }

      const cachedProduct = await redis.get(`product:${id}`);
      if (cachedProduct) {
        console.log("ProductController.getById: Data from cache");
        sendResponse(res, 200, { data: JSON.parse(cachedProduct) });
        return;
      }

      const product = await this.productModel.getProductById(id);
      if (!product) {
        sendResponse(res, 404, {
          status: STATUS_ERROR,
          message: `Product ${NOT_FOUND}`,
        });
        return;
      }

      await redis.setex(`product:${id}`, 3600, JSON.stringify(product));

      console.log("ProductController.getById: Data from database");
      sendResponse(res, 200, { data: product });
    } catch (error) {
      console.error("ProductController.getById:", error);
      sendResponse(res, 500, {
        status: STATUS_ERROR,
        message: INTERNAL_SERVER_ERROR,
      });
    }
  };

  create = async (req: Request, res: Response) => {
    try {
      const productData = req.body;
      const errors = validateProductSchema("create", productData);
      if (Object.keys(errors).length > 0) {
        sendResponse(res, 400, {
          errors,
          status: STATUS_ERROR,
          message: VALIDATION_ERROR,
        });
        return;
      }

      const existingProduct = await this.productModel.getProductBySku(
        productData.sku
      );
      if (existingProduct) {
        sendResponse(res, 400, {
          status: STATUS_ERROR,
          message: "Product with this SKU already exists",
        });
        return;
      }

      const existingStore = await this.storeModel.getStoreById(
        productData.storeId
      );
      if (!existingStore) {
        sendResponse(res, 404, {
          status: STATUS_ERROR,
          message: `Store ${NOT_FOUND}`,
        });
        return;
      }

      const product = await this.productModel.createProduct(productData);

      await redis.del(`product:${product.id}`);

      sendResponse(res, 201, { data: product });
    } catch (error) {
      console.error("ProductController.create:", error);
      sendResponse(res, 500, {
        status: STATUS_ERROR,
        message: INTERNAL_SERVER_ERROR,
      });
    }
  };

  update = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!validateUuid(id)) {
        sendResponse(res, 400, {
          status: STATUS_ERROR,
          message: UUID_INVALID,
        });
        return;
      }
      const productData = req.body;
      const errors = validateProductSchema("update", productData);
      if (Object.keys(errors).length > 0) {
        sendResponse(res, 400, {
          errors,
          status: STATUS_ERROR,
          message: VALIDATION_ERROR,
        });
        return;
      }

      const existingProduct = await this.productModel.getProductById(id);
      if (!existingProduct) {
        sendResponse(res, 404, {
          status: STATUS_ERROR,
          message: `Product ${NOT_FOUND}`,
        });
        return;
      }

      const existingStore = await this.storeModel.getStoreById(
        productData.storeId
      );
      if (!existingStore) {
        sendResponse(res, 404, {
          status: STATUS_ERROR,
          message: `Store ${NOT_FOUND}`,
        });
        return;
      }

      const product = await this.productModel.updateProduct(id, productData);

      await redis.del(`product:${id}`);

      sendResponse(res, 200, { data: product });
    } catch (error) {
      console.error("ProductController.update:", error);
      sendResponse(res, 500, {
        status: STATUS_ERROR,
        message: INTERNAL_SERVER_ERROR,
      });
    }
  };

  delete = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      if (!validateUuid(id)) {
        sendResponse(res, 400, {
          status: STATUS_ERROR,
          message: UUID_INVALID,
        });
        return;
      }
      const existingProduct = await this.productModel.getProductById(id);
      if (!existingProduct) {
        sendResponse(res, 404, {
          status: STATUS_ERROR,
          message: `Product ${NOT_FOUND}`,
        });
        return;
      }

      await this.productModel.deleteProduct(id);

      await redis.del(`product:${id}`);

      sendResponse(res, 204, {});
    } catch (error) {
      console.error("ProductController.delete:", error);
      sendResponse(res, 500, {
        status: STATUS_ERROR,
        message: INTERNAL_SERVER_ERROR,
      });
    }
  };
}
