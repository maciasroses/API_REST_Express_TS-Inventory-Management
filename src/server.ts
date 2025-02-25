import { createApp } from "./app";
import { ProductModel, StoreModel, InventoryModel } from "./models";

const PORT = process.env.PORT || 3000;

const app = createApp({
  productModel: ProductModel,
  storeModel: StoreModel,
  inventoryModel: InventoryModel,
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
