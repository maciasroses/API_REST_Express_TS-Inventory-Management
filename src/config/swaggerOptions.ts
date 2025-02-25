import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Inventory Management API",
      version: "1.0.0",
      description: "API to manage inventory",
    },
    servers: [
      {
        url: process.env.SWAGGER_SERVER_URL || "http://localhost:3000/api",
      },
    ],
    components: {
      schemas: {
        Inventory: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "bb7cfc89-4137-4823-a1a2-65a3f5c4573e",
            },
            productId: {
              type: "string",
              format: "uuid",
              example: "bb7cfc89-4137-4823-a1a2-65a3f5c4573e",
            },
            storeId: {
              type: "string",
              format: "uuid",
              example: "bb7cfc89-4137-4823-a1a2-65a3f5c4573e",
            },
            quantity: {
              type: "number",
              example: 100,
            },
            minStock: {
              type: "number",
              example: 10,
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2021-10-01T00:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2021-10-01T00:00:00Z",
            },
          },
        },
        Product: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "bb7cfc89-4137-4823-a1a2-65a3f5c4573e",
            },
            name: {
              type: "string",
              example: "4K Monitor",
            },
            description: {
              type: "string",
              description: "27-inch monitor with 4K resolution",
            },
            category: {
              type: "string",
              description: "Electronics",
            },
            price: {
              type: "number",
              format: "float",
              example: 300,
            },
            sku: {
              type: "string",
              example: "MONITOR-4K-003",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2021-10-01T00:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2021-10-01T00:00:00Z",
            },
          },
        },
        Store: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "bb7cfc89-4137-4823-a1a2-65a3f5c4573e",
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2021-10-01T00:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2021-10-01T00:00:00Z",
            },
          },
        },
        Movement: {
          type: "object",
          properties: {
            id: {
              type: "string",
              format: "uuid",
              example: "bb7cfc89-4137-4823-a1a2-65a3f5c4573e",
            },
            productId: {
              type: "string",
              format: "uuid",
              example: "bb7cfc89-4137-4823-a1a2-65a3f5c4573e",
            },
            sourceStoreId: {
              type: "string",
              format: "uuid",
              example: "bb7cfc89-4137-4823-a1a2-65a3f5c4573e",
            },
            targetStoreId: {
              type: "string",
              format: "uuid",
              example: "bb7cfc89-4137-4823-a1a2-65a3f5c4573e",
            },
            quantity: {
              type: "number",
              example: 100,
            },
            timestamp: {
              type: "string",
              format: "date-time",
              example: "2021-10-01T00:00:00Z",
            },
            type: {
              type: "string",
              example: "IN",
              enum: ["IN", "OUT", "TRANSFER"],
            },
            createdAt: {
              type: "string",
              format: "date-time",
              example: "2021-10-01T00:00:00Z",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
              example: "2021-10-01T00:00:00Z",
            },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
