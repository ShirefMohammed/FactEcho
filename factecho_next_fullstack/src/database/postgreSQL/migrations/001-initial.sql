-- Enable pgcrypto extension for UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Function to update 'updated_at' timestamp
CREATE OR REPLACE FUNCTION update_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to update 'updated_at' in the users table for related changes
CREATE OR REPLACE FUNCTION update_users_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET updated_at = CURRENT_TIMESTAMP
  WHERE user_id = NEW.user_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- users table
CREATE TABLE users (
  user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE,
  password TEXT,
  is_verified BOOLEAN NOT NULL DEFAULT FALSE,
  role INTEGER NOT NULL DEFAULT 2001,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Creating an index on name and email to speed up search queries
CREATE INDEX idx_users_name_email_partial ON users (name, email) WHERE email IS NOT NULL;

-- Trigger for users to update 'updated_at' on updates to the table itself
CREATE TRIGGER trigger_update_timestamp
BEFORE UPDATE ON users
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- users_oauth table
CREATE TABLE users_oauth (
  user_id UUID PRIMARY KEY,
  provider TEXT NOT NULL,
  provider_user_id TEXT NOT NULL,
  UNIQUE (provider, provider_user_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Trigger for users_oauth to update 'updated_at' in users
CREATE TRIGGER trigger_update_users_timestamp_oauth
AFTER INSERT OR UPDATE OR DELETE ON users_oauth
FOR EACH ROW
EXECUTE FUNCTION update_users_timestamp();

-- users_verification_tokens table
CREATE TABLE users_verification_tokens (
  user_id UUID PRIMARY KEY,
  verification_token TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Trigger for users_verification_tokens to update 'updated_at' in users
CREATE TRIGGER trigger_update_users_timestamp_verification
AFTER INSERT OR UPDATE OR DELETE ON users_verification_tokens
FOR EACH ROW
EXECUTE FUNCTION update_users_timestamp();

-- users_reset_password_tokens table
CREATE TABLE users_reset_password_tokens (
  user_id UUID PRIMARY KEY,
  reset_password_token TEXT NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Trigger for users_reset_password_tokens to update 'updated_at' in users
CREATE TRIGGER trigger_update_users_timestamp_reset_password
AFTER INSERT OR UPDATE OR DELETE ON users_reset_password_tokens
FOR EACH ROW
EXECUTE FUNCTION update_users_timestamp();

-- users_avatars table
CREATE TABLE users_avatars (
  user_id UUID PRIMARY KEY,
  avatar TEXT NOT NULL DEFAULT 'https://res.cloudinary.com/dtw6e1hhh/image/upload/v1733077686/defaultAvatar.jpg',
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Trigger for users_avatars to update 'updated_at' in users
CREATE TRIGGER trigger_update_users_timestamp_avatar
AFTER INSERT OR UPDATE OR DELETE ON users_avatars
FOR EACH ROW
EXECUTE FUNCTION update_users_timestamp();

-- categories table
CREATE TABLE categories (
  category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT UNIQUE NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  creator_id UUID NOT NULL,
  FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Trigger for categories to update 'updated_at' on updates
CREATE TRIGGER trigger_update_timestamp_categories
BEFORE UPDATE ON categories
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- articles table
CREATE TABLE articles (
  article_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT UNIQUE NOT NULL,
  content TEXT NOT NULL,
  image TEXT DEFAULT 'defaultArticleImage.png',
  views INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  category_id UUID NOT NULL,
  creator_id UUID NOT NULL,
  FOREIGN KEY (category_id) REFERENCES categories(category_id) ON DELETE SET NULL,
  FOREIGN KEY (creator_id) REFERENCES users(user_id) ON DELETE SET NULL
);

-- Trigger for articles to update 'updated_at' on updates
CREATE TRIGGER trigger_update_timestamp_articles
BEFORE UPDATE ON articles
FOR EACH ROW
EXECUTE FUNCTION update_timestamp();

-- users_saved_articles table
CREATE TABLE users_saved_articles (
  user_id UUID NOT NULL,
  article_id UUID NOT NULL,
  PRIMARY KEY (user_id, article_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (article_id) REFERENCES articles(article_id) ON DELETE CASCADE
);

-- author_permissions table
CREATE TABLE author_permissions (
  user_id UUID NOT NULL PRIMARY KEY,
  "create" BOOLEAN NOT NULL DEFAULT TRUE,
  update BOOLEAN NOT NULL DEFAULT TRUE,
  delete BOOLEAN NOT NULL DEFAULT TRUE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- Table to track record counts for each table
CREATE TABLE records_count (
  table_name TEXT PRIMARY KEY,
  record_count INTEGER NOT NULL DEFAULT 0
);

-- Insert initial counts for all tracked tables
INSERT INTO records_count (table_name, record_count)
VALUES
  ('users', 0),
  ('categories', 0),
  ('articles', 0);

-- Function to update record counts on insert or delete
CREATE OR REPLACE FUNCTION update_record_count()
RETURNS TRIGGER AS $$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    UPDATE records_count SET record_count = record_count + 1 WHERE table_name = TG_TABLE_NAME;
  ELSIF (TG_OP = 'DELETE') THEN
    UPDATE records_count SET record_count = record_count - 1 WHERE table_name = TG_TABLE_NAME;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add triggers to update counts on insert and delete for each table
CREATE TRIGGER trigger_update_users_count
AFTER INSERT OR DELETE ON users
FOR EACH ROW EXECUTE FUNCTION update_record_count();

CREATE TRIGGER trigger_update_categories_count
AFTER INSERT OR DELETE ON categories
FOR EACH ROW EXECUTE FUNCTION update_record_count();

CREATE TRIGGER trigger_update_articles_count
AFTER INSERT OR DELETE ON articles
FOR EACH ROW EXECUTE FUNCTION update_record_count();
