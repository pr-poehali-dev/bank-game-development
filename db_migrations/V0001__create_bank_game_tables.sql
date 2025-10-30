-- Создание таблицы пользователей
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(100) UNIQUE NOT NULL,
    balance BIGINT DEFAULT 170000,
    is_bot BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы товаров на маркетплейсе
CREATE TABLE IF NOT EXISTS marketplace_products (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    price BIGINT NOT NULL,
    description TEXT,
    image_url TEXT,
    is_sold BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы недвижимости
CREATE TABLE IF NOT EXISTS real_estate (
    id SERIAL PRIMARY KEY,
    seller_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    price BIGINT NOT NULL,
    address VARCHAR(255),
    rooms INTEGER,
    area NUMERIC(10, 2),
    description TEXT,
    image_url TEXT,
    is_sold BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы вкладов
CREATE TABLE IF NOT EXISTS user_deposits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    deposit_name VARCHAR(100) NOT NULL,
    amount BIGINT NOT NULL,
    rate NUMERIC(5, 2) NOT NULL,
    term_months INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL
);

-- Создание таблицы кредитов
CREATE TABLE IF NOT EXISTS user_credits (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    credit_name VARCHAR(100) NOT NULL,
    amount BIGINT NOT NULL,
    rate NUMERIC(5, 2) NOT NULL,
    term_months INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы бизнесов пользователя
CREATE TABLE IF NOT EXISTS user_businesses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    business_name VARCHAR(100) NOT NULL,
    cost BIGINT NOT NULL,
    monthly_income BIGINT NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создание таблицы транзакций
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    from_user_id INTEGER REFERENCES users(id),
    to_user_id INTEGER REFERENCES users(id),
    amount BIGINT NOT NULL,
    type VARCHAR(50) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Индексы для производительности
CREATE INDEX IF NOT EXISTS idx_marketplace_products_seller ON marketplace_products(seller_id);
CREATE INDEX IF NOT EXISTS idx_marketplace_products_sold ON marketplace_products(is_sold);
CREATE INDEX IF NOT EXISTS idx_real_estate_seller ON real_estate(seller_id);
CREATE INDEX IF NOT EXISTS idx_real_estate_sold ON real_estate(is_sold);
CREATE INDEX IF NOT EXISTS idx_user_deposits_user ON user_deposits(user_id);
CREATE INDEX IF NOT EXISTS idx_user_credits_user ON user_credits(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_users ON transactions(from_user_id, to_user_id);
