CREATE EXTENSION IF NOT EXISTS "pgcrypto";
--users table:(user_id, username, email, password, watchlist_items)
CREATE TABLE users (
    user_id UUID DEFAULT gen_random_uuid() PRIMARY KEY NOT NULL UNIQUE,
    username TEXT NOT NULL UNIQUE,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    watchlist_items INT DEFAULT 0 NOT NULL  --count of watchlist items
);
--watchlist table:(username, asset_id, asset_name, asset_info)
CREATE TABLE watchlist (
    username TEXT NOT NULL,
    asset_id TEXT PRIMARY KEY NOT NULL,
    asset_name TEXT,
    asset_info TEXT,
    FOREIGN KEY (username) REFERENCES users (username) ON DELETE CASCADE
);


