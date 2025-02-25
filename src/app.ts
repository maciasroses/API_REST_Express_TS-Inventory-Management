import express from "express";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swaggerOptions";
import { corsMiddleware } from "./middlewares/cors";
import { ProductRouter, StoreRouter, InventoryRouter } from "./routes";
import type { IInventoryModel, IProductModel, IStoreModel } from "./interfaces";

interface ICreateApp {
  storeModel: IStoreModel;
  productModel: IProductModel;
  inventoryModel: IInventoryModel;
}

export const createApp = ({
  storeModel,
  productModel,
  inventoryModel,
}: ICreateApp) => {
  const app = express();
  const apiRouter = express.Router();

  app.use(express.json());
  app.use(corsMiddleware());
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  apiRouter.get("/health", (_req, res) => {
    res.json({ service: "Ok" });
  });

  apiRouter.use("/products", ProductRouter({ productModel, storeModel }));

  apiRouter.use("/stores", StoreRouter({ storeModel, inventoryModel }));

  apiRouter.use(
    "/inventory",
    InventoryRouter({ inventoryModel, productModel, storeModel })
  );

  app.use("/api", apiRouter);
  return app;
};
