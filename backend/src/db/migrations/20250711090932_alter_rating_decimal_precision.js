exports.up = function (knex) {
  return knex.schema
    .alterTable("movies", function (table) {
      table.decimal("average_rating", 4, 1).alter();
    })
    .then(() => {
      return knex.schema.alterTable("reviews", function (table) {
        table.decimal("rating", 4, 1).alter();
      });
    });
};

exports.down = function (knex) {
  return knex.schema
    .alterTable("movies", function (table) {
      table.decimal("average_rating", 3, 1).alter();
    })
    .then(() => {
      return knex.schema.alterTable("reviews", function (table) {
        table.decimal("rating", 3, 1).alter();
      });
    });
};
