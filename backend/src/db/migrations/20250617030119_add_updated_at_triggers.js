// src/db/migrations/[timestamp]_add_updated_at_triggers.js
exports.up = function (knex) {
  return knex.schema.raw(`
    CREATE OR REPLACE FUNCTION update_timestamp()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = NOW();
        RETURN NEW;
    END;
    $$ LANGUAGE plpgsql;

    CREATE TRIGGER update_users_timestamp
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

    CREATE TRIGGER update_movies_timestamp
    BEFORE UPDATE ON movies
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

    CREATE TRIGGER update_reviews_timestamp
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();

    CREATE TRIGGER update_watchlists_timestamp
    BEFORE UPDATE ON watchlists
    FOR EACH ROW
    EXECUTE FUNCTION update_timestamp();
  `);
};

exports.down = function (knex) {
  return knex.schema.raw(`
    DROP TRIGGER IF EXISTS update_users_timestamp ON users;
    DROP TRIGGER IF EXISTS update_movies_timestamp ON movies;
    DROP TRIGGER IF EXISTS update_reviews_timestamp ON reviews;
    DROP TRIGGER IF EXISTS update_watchlists_timestamp ON watchlists;
    DROP FUNCTION IF EXISTS update_timestamp();
  `);
};
