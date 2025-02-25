# Inventory Management

## Installation instructions

### Prerequisites

- Docker
- Docker compose
- Node.js (version 22)
- PostgreSQL
- Redis

### Steps

1. Clone the repository

> `git clone https://github.com/maciasroses/API_REST_Express_TS-Inventory-Management`
>
> `cd https://github.com/maciasroses/API_REST_Express_TS-Inventory-Management`

2. Build and start the Docker container:

> `docker-compose up --build`

3. The API will be available at http://localhost:3000

## General Documentation

### Overview

This project is an API for managing inventory, built with Node.js, Express, and Typescript. It uses PostgreSQL for data storage and Redis for caching. The API provides endpoints for managing products, stores, and inventory, including transferring products between stores and retrieving low stock alerts.

### Database Model

<img alt="Database model" src="database model.png" />

### Endpoints

- <strong>Products</strong>
  - `GET /api/products`: Get all products
  - `GET /api/products/:id`: Get a product by ID
  - `POST /api/products`: Create a new product
  - `PUT /api/products/:id`: Update a product
  - `DELETE /api/products/:id`: Delete a product
- <strong>Stores</strong>
  - `GET /api/stores/:id/inventory`: Get inventory by store ID
- <strong>Inventory</strong>
  - `POST /api/inventory/transfer`: Transfer a product between stores
  - `GET /api/inventory/transfer`: Get low stock alerts

## Running Tests

- Unit tests:
  > `npm run test:unit`
- Integration tests:
  > `npm run test:integration`
- Load tests:
  > `npm run test:load`

## Technical Decisions

### Database

- <strong>PostgreSQL</strong>: Chosen for its robustness and support for complex queries and transactions.
- <strong>Redis</strong>: Used for caching to improve performance by reducing database load.

### Framework and Libraries

- <strong>Express</strong>: A minimal and flexible Node.js web application framework.
- <strong>Typescript</strong>: Provides static typing, which helps catch errors early and improves code quality.
- <strong>Zod</strong>: Used for schema validation to ensure data integrity.
- <strong>Swagger</strong>: Used for API documentation, making it easier to understand and use the API.

### Testing

- <strong>Jest</strong>: Used for unit and integration testing.
- <strong>Supertest</strong>: Used for testing HTTP endpoints.
- <strong>Artillery</strong>: Used for testing to ensure the API can handle high traffic.

## Architecture Diagram

| Client |
| ------ |

| API Gateway         |
| ------------------- |
| (Express + Swagger) |

| Controllers                 |
| --------------------------- |
| (Product, Store, Inventory) |

| Services         |
| ---------------- |
| (Business Logic) |

| Models                      |
| --------------------------- |
| (Product, Store, Inventory) |

| Data Access Layer   |
| ------------------- |
| (PostgreSQL, Redis) |

### Components

- <strong>API Gateway</strong>: Handles incoming HTTP requests and routes them to the appropriate controllers.
- <strong>Controllers</strong>: Contain the logic for handling requests and responses.
- <strong>Services</strong>: Contain the business logic of the application.
- <strong>Models</strong>: Represent the data structures and handle database interactions.
- <strong>Data Access Layer</strong>: Manages connections to PostgreSQL and Redis.

<small>This architecture ensures a clear separation of concerns, making the codebase easier to maintain and extend.</small>

## Deployment Instructions

### Fly.io

1. Clone the repository:

   > `git clone https://github.com/maciasroses/API_REST_Express_TS-Inventory-Management`
   >
   > `cd https://github.com/maciasroses/API_REST_Express_TS-Inventory-Management`

2. Install the Fly.io CLI:

   > `curl -L https://fly.io/install.sh | sh`

3. Login to Fly.io:

   > `flyctl auth login`

4. Initialize a new Fly.io application:

   > `flyctl launch`

   <small>Follow the prompts to set up your application. Choose a unique name for your app and select a region.</small>

5. Create a PostgreSQL database on Fly.io:

   > `flyctl postgres create`

   <small>Follo the prompts to set up your PostgreSQL database. Note the connection details provided.</small>

6. Set the environment variables on Fly.io:

   > `flyctl secrets set PORT=<your-port>`
   >
   > `flyctl secrets set NODE_ENV=<your-node-env>`
   >
   > `flyctl secrets set SWAGGER_SERVER_URL=<your-swagger-server-url>`
   >
   > `flyctl secrets set DATABASE_URL=<your-database-url>`
   >
   > `flyctl secrets set REDIS_HOST=<your-redis-host>`
   >
   > `flyctl secrets set REDIS_PORT=<your-redis-port>`

7. Deploy your application to Fly.io:

   > `flyctl deploy`

8. Access your deployed application:
   > `flyctl open`
