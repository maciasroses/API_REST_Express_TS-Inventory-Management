-- EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- TABLES
CREATE TABLE IF NOT EXISTS store (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS product (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    category VARCHAR(255) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    sku VARCHAR(255) UNIQUE NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS inventory (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    productId UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    storeId UUID NOT NULL REFERENCES store(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    minStock INTEGER NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (productId, storeId)
);
DO $$ BEGIN IF NOT EXISTS (
    SELECT 1
    FROM pg_type
    WHERE typname = 'movement_type'
) THEN CREATE TYPE movement_type AS ENUM ('IN', 'OUT', 'TRANSFER');
END IF;
END $$;
CREATE TABLE IF NOT EXISTS movement (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    productId UUID NOT NULL REFERENCES product(id) ON DELETE CASCADE,
    sourceStoreId UUID REFERENCES store(id) ON DELETE CASCADE,
    targetStoreId UUID REFERENCES store(id) ON DELETE CASCADE,
    quantity INTEGER NOT NULL,
    timestamp TIMESTAMP NOT NULL,
    type movement_type NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- INDEXES
CREATE INDEX IF NOT EXISTS idx_product_name ON product(name);
CREATE INDEX IF NOT EXISTS idx_product_name_sku ON product(name, sku);
CREATE INDEX IF NOT EXISTS idx_product_category ON product(category);
CREATE INDEX IF NOT EXISTS idx_product_price ON product(price);
CREATE INDEX IF NOT EXISTS idx_inventory_product_store ON inventory(productId, storeId);
CREATE INDEX IF NOT EXISTS idx_inventory_quantity ON inventory(quantity);
CREATE INDEX IF NOT EXISTS idx_inventory_store_quantity ON inventory(storeId, quantity);
CREATE INDEX IF NOT EXISTS idx_movement_productId ON movement(productId);
CREATE INDEX IF NOT EXISTS idx_movement_product_type ON movement(productId, type);
CREATE INDEX IF NOT EXISTS idx_movement_source_store ON movement(sourceStoreId);
CREATE INDEX IF NOT EXISTS idx_movement_target_store ON movement(targetStoreId);
CREATE INDEX IF NOT EXISTS idx_movement_timestamp ON movement(timestamp);
-- TRIGGERS
CREATE OR REPLACE FUNCTION set_updated_at() RETURNS TRIGGER AS $$ BEGIN IF NEW.* IS DISTINCT
FROM OLD.* THEN NEW.updated_at = CURRENT_TIMESTAMP;
END IF;
RETURN NEW;
END;
$$ LANGUAGE plpgsql;
DROP TRIGGER IF EXISTS set_updated_at ON store;
DROP TRIGGER IF EXISTS set_updated_at ON product;
DROP TRIGGER IF EXISTS set_updated_at ON inventory;
DROP TRIGGER IF EXISTS set_updated_at ON movement;
CREATE TRIGGER set_updated_at BEFORE
UPDATE ON store FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at BEFORE
UPDATE ON product FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at BEFORE
UPDATE ON inventory FOR EACH ROW EXECUTE FUNCTION set_updated_at();
CREATE TRIGGER set_updated_at BEFORE
UPDATE ON movement FOR EACH ROW EXECUTE FUNCTION set_updated_at();
-- INITIAL DATA
-- Stores
INSERT INTO store (id, created_at, updated_at)
SELECT '123e4567-e89b-12d3-a456-426614174000',
    NOW(),
    NOW()
WHERE NOT EXISTS (
        SELECT 1
        FROM store
        WHERE id = '123e4567-e89b-12d3-a456-426614174000'
    );
INSERT INTO store (id, created_at, updated_at)
SELECT 'a1b2c3d4-e56f-78a9-b012-345678901234',
    NOW(),
    NOW()
WHERE NOT EXISTS (
        SELECT 1
        FROM store
        WHERE id = 'a1b2c3d4-e56f-78a9-b012-345678901234'
    );
INSERT INTO store (id, created_at, updated_at)
SELECT 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    NOW(),
    NOW()
WHERE NOT EXISTS (
        SELECT 1
        FROM store
        WHERE id = 'f47ac10b-58cc-4372-a567-0e02b2c3d479'
    );
-- Products
INSERT INTO product (
        id,
        name,
        description,
        category,
        price,
        sku,
        created_at,
        updated_at
    )
SELECT '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    'Gaming Laptop',
    'High performance laptop for gaming',
    'Electronics',
    1500.00,
    'LAPTOP-GAMER-001',
    NOW(),
    NOW()
WHERE NOT EXISTS (
        SELECT 1
        FROM product
        WHERE id = '6ba7b810-9dad-11d1-80b4-00c04fd430c8'
    );
INSERT INTO product (
        id,
        name,
        description,
        category,
        price,
        sku,
        created_at,
        updated_at
    )
SELECT 'e6b9849b-f0c9-4be7-b3e2-7e10fb85d283',
    'Wireless Mouse',
    'Ergonomic and rechargeable mouse',
    'Accessories',
    50.00,
    'MOUSE-INAL-002',
    NOW(),
    NOW()
WHERE NOT EXISTS (
        SELECT 1
        FROM product
        WHERE id = 'e6b9849b-f0c9-4be7-b3e2-7e10fb85d283'
    );
INSERT INTO product (
        id,
        name,
        description,
        category,
        price,
        sku,
        created_at,
        updated_at
    )
SELECT 'bb7cfc89-4137-4823-a1a2-65a3f5c4573e',
    '4K Monitor',
    '27-inch monitor with 4K resolution',
    'Electronics',
    300.00,
    'MONITOR-4K-003',
    NOW(),
    NOW()
WHERE NOT EXISTS (
        SELECT 1
        FROM product
        WHERE id = 'bb7cfc89-4137-4823-a1a2-65a3f5c4573e'
    );
-- Inventory
INSERT INTO inventory (
        id,
        productId,
        storeId,
        quantity,
        minStock,
        created_at,
        updated_at
    )
SELECT '2c6d48ab-b4d1-4a2f-8fc3-6bc36a597693',
    '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    '123e4567-e89b-12d3-a456-426614174000',
    10,
    2,
    NOW(),
    NOW()
WHERE NOT EXISTS (
        SELECT 1
        FROM inventory
        WHERE id = '2c6d48ab-b4d1-4a2f-8fc3-6bc36a597693'
    );
INSERT INTO inventory (
        id,
        productId,
        storeId,
        quantity,
        minStock,
        created_at,
        updated_at
    )
SELECT 'd68e8f40-1b3f-4f7c-a890-e7f7a5d4d8c6',
    'e6b9849b-f0c9-4be7-b3e2-7e10fb85d283',
    '123e4567-e89b-12d3-a456-426614174000',
    20,
    5,
    NOW(),
    NOW()
WHERE NOT EXISTS (
        SELECT 1
        FROM inventory
        WHERE id = 'd68e8f40-1b3f-4f7c-a890-e7f7a5d4d8c6'
    );
INSERT INTO inventory (
        id,
        productId,
        storeId,
        quantity,
        minStock,
        created_at,
        updated_at
    )
SELECT '9b0fd287-6a9c-4b74-a239-b3a01abf7c28',
    'bb7cfc89-4137-4823-a1a2-65a3f5c4573e',
    'a1b2c3d4-e56f-78a9-b012-345678901234',
    0,
    1,
    NOW(),
    NOW()
WHERE NOT EXISTS (
        SELECT 1
        FROM inventory
        WHERE id = '9b0fd287-6a9c-4b74-a239-b3a01abf7c28'
    );
INSERT INTO inventory (
        id,
        productId,
        storeId,
        quantity,
        minStock,
        created_at,
        updated_at
    )
SELECT 'db32f3f9-4fae-487b-94e7-697dfbe39a53',
    '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    1,
    2,
    NOW(),
    NOW()
WHERE NOT EXISTS (
        SELECT 1
        FROM inventory
        WHERE id = 'db32f3f9-4fae-487b-94e7-697dfbe39a53'
    );
-- Movements
INSERT INTO movement (
        id,
        productId,
        sourceStoreId,
        targetStoreId,
        quantity,
        timestamp,
        type,
        created_at,
        updated_at
    )
SELECT '2db015b9-784d-4c88-b9d9-bb0ca7e0ad12',
    '6ba7b810-9dad-11d1-80b4-00c04fd430c8',
    '123e4567-e89b-12d3-a456-426614174000',
    'a1b2c3d4-e56f-78a9-b012-345678901234',
    3,
    NOW(),
    'TRANSFER',
    NOW(),
    NOW()
WHERE NOT EXISTS (
        SELECT 1
        FROM movement
        WHERE id = '2db015b9-784d-4c88-b9d9-bb0ca7e0ad12'
    );
INSERT INTO movement (
        id,
        productId,
        sourceStoreId,
        targetStoreId,
        quantity,
        timestamp,
        type,
        created_at,
        updated_at
    )
SELECT '11f7d3e3-c3c4-4c29-9fdb-b18f33b8b035',
    'e6b9849b-f0c9-4be7-b3e2-7e10fb85d283',
    '123e4567-e89b-12d3-a456-426614174000',
    NULL,
    5,
    NOW(),
    'OUT',
    NOW(),
    NOW()
WHERE NOT EXISTS (
        SELECT 1
        FROM movement
        WHERE id = '11f7d3e3-c3c4-4c29-9fdb-b18f33b8b035'
    );
INSERT INTO movement (
        id,
        productId,
        sourceStoreId,
        targetStoreId,
        quantity,
        timestamp,
        type,
        created_at,
        updated_at
    )
SELECT '8b1f3a74-b9a1-4dcb-9500-3c6cc5cb7e1f',
    'bb7cfc89-4137-4823-a1a2-65a3f5c4573e',
    NULL,
    'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    2,
    NOW(),
    'IN',
    NOW(),
    NOW()
WHERE NOT EXISTS (
        SELECT 1
        FROM movement
        WHERE id = '8b1f3a74-b9a1-4dcb-9500-3c6cc5cb7e1f'
    );