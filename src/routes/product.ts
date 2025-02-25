import { Router } from "express";
import ProductController from "../controllers/product";
import type { IProductModel, IStoreModel } from "../interfaces";

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: API to manage products
 */

/**
 * @swagger
 * /products:
 *   get:
 *     summary: Get all products
 *     description: Returns a list of all products
 *     tags: [Products]
 *     parameters:
 *       - name: category
 *         in: query
 *         description: Filter by category
 *         required: false
 *         schema:
 *           type: string
 *           example: "Electronics"
 *       - name: minPrice
 *         in: query
 *         description: Filter by minimum price
 *         required: false
 *         schema:
 *           type: number
 *           example: 100
 *       - name: maxPrice
 *         in: query
 *         description: Filter by maximum price
 *         required: false
 *         schema:
 *           type: number
 *           example: 2000
 *       - name: minStock
 *         in: query
 *         description: Filter by minimum stock
 *         required: false
 *         schema:
 *           type: number
 *           example: 1
 *       - name: maxStock
 *         in: query
 *         description: Filter by maximum stock
 *         required: false
 *         schema:
 *           type: number
 *           example: 15
 *       - name: page
 *         in: query
 *         description: Filter by page number
 *         required: false
 *         schema:
 *           type: number
 *           example: 1
 *       - name: limit
 *         in: query
 *         description: Filter by limit of products per page
 *         required: false
 *         schema:
 *           type: number
 *           example: 2
 *     responses:
 *       200:
 *         description: A list of products
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
 *                         example: "bb7cfc89-4137-4823-a1a2-65a3f5c4573e"
 *                       name:
 *                         type: string
 *                         example: "4K Monitor"
 *                       description:
 *                         type: string
 *                         example: "27-inch monitor with 4K resolution"
 *                       category:
 *                         type: string
 *                         example: "Electronics"
 *                       price:
 *                         type: number
 *                         example: 300
 *                       sku:
 *                         type: string
 *                         example: "MONITOR-4K-003"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                       stock:
 *                         type: number
 *                         example: 10
 *                       storeid:
 *                         type: string
 *                         example: "a1b2c3d4-e56f-78a9-b012-345678901234"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: number
 *                       example: 4
 *                     page:
 *                       type: number
 *                       example: 1
 *                     page_size:
 *                       type: number
 *                       example: 1
 *                     total_pages:
 *                       type: number
 *                       example: 4
 *                     has_next:
 *                       type: boolean
 *                       example: true
 *                     has_prev:
 *                       type: boolean
 *                       example: false
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
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     description: Returns a product by ID
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         description: Product ID
 *         required: true
 *         schema:
 *           type: string
 *           example: "bb7cfc89-4137-4823-a1a2-65a3f5c4573e"
 *     responses:
 *       200:
 *         description: A product
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
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "bb7cfc89-4137-4823-a1a2-65a3f5c4573e"
 *                     name:
 *                       type: string
 *                       example: "4K Monitor"
 *                     description:
 *                       type: string
 *                       example: "27-inch monitor with 4K resolution"
 *                     category:
 *                       type: string
 *                       example: "Electronics"
 *                     price:
 *                       type: number
 *                       example: 300
 *                     sku:
 *                       type: string
 *                       example: "MONITOR-4K-003"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     stock:
 *                       type: number
 *                       example: 10
 *                 pagination:
 *                   type: object
 *                   example: {}
 *                 errors:
 *                   type: object
 *                   example: {}
 *       400:
 *         description: Invalid product UUID
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
 *                   example: "Invalid UUID"
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
 *         description: Product not found
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
 * /products:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - category
 *               - price
 *               - sku
 *               - storeId
 *               - quantity
 *               - minStock
 *             properties:
 *               name:
 *                 type: string
 *                 example: "test"
 *               description:
 *                 type: string
 *                 example: "test"
 *               category:
 *                 type: string
 *                 example: "test"
 *               price:
 *                 type: number
 *                 example: 22
 *               sku:
 *                 type: string
 *                 example: "test"
 *               storeId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               quantity:
 *                 type: number
 *                 example: 22
 *               minStock:
 *                 type: number
 *                 example: 1
 *     responses:
 *       201:
 *         description: Product created
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
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "bb7cfc89-4137-4823-a1a2-65a3f5c4573e"
 *                     name:
 *                       type: string
 *                       example: "test"
 *                     description:
 *                       type: string
 *                       example: "test"
 *                     category:
 *                       type: string
 *                       example: "test"
 *                     price:
 *                       type: number
 *                       example: 22
 *                     sku:
 *                       type: string
 *                       example: "test"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
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
 *                       example: "Product with this SKU already exists"
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

/**
 * @swagger
 * /products/{id}:
 *   put:
 *     summary: Update an existing product
 *     description: Updates an existing product with the given ID.
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: UUID of the product to update
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "updated product"
 *               description:
 *                 type: string
 *                 example: "updated description"
 *               category:
 *                 type: string
 *                 example: "updated category"
 *               price:
 *                 type: number
 *                 example: 30.5
 *               sku:
 *                 type: string
 *                 example: "updated-sku"
 *               storeId:
 *                 type: string
 *                 example: "123e4567-e89b-12d3-a456-426614174000"
 *               quantity:
 *                 type: number
 *                 example: 50
 *               minStock:
 *                 type: number
 *                 example: 5
 *     responses:
 *       200:
 *         description: Product successfully updated
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
 *                   type: object
 *                   example:
 *                     id: "bb7cfc89-4137-4823-a1a2-65a3f5c4573e"
 *                     name: "updated product"
 *                     description: "updated description"
 *                     category: "updated category"
 *                     price: 30.5
 *                     sku: "updated-sku"
 *                     createdAt: "2021-09-01T00:00:00.000Z"
 *                     updatedAt: "2021-09-01T00:00:00.000Z"
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
 *                       example: "UUID is invalid"
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
 * /products/{id}:
 *   delete:
 *     summary: Delete an existing product
 *     description: Deletes an existing product with the given ID.
 *     tags: [Products]
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         description: UUID of the product to delete
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       204:
 *         description: Product successfully deleted
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
 *                       example: "UUID is invalid"
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
 *         description: Product not found
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

const ProductRouter = ({
  storeModel,
  productModel,
}: {
  storeModel: IStoreModel;
  productModel: IProductModel;
}) => {
  const productRouter = Router();

  const productController = new ProductController({ productModel, storeModel });

  productRouter.get("/", productController.getAll);
  productRouter.get("/:id", productController.getById);
  productRouter.post("/", productController.create);
  productRouter.put("/:id", productController.update);
  productRouter.delete("/:id", productController.delete);

  return productRouter;
};

export default ProductRouter;
