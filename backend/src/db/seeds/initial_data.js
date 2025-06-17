// src/db/seeds/[timestamp]_initial_data.js
exports.seed = async function (knex) {
  // Deletes ALL existing entries
  await knex("watchlists").del();
  await knex("reviews").del();
  await knex("movie_genres").del();
  await knex("movies").del();
  await knex("genres").del();
  await knex("users").del();

  // Insert users
  const [user1] = await knex("users")
    .insert({
      username: "john_doe",
      email: "john@example.com",
      password_hash:
        "$2a$10$y.XbZgM/PzQx.u.q.V.Q.l.g.O.r.S.y.Z.2.V.4.N.5.O.r.L.t.V.6.W.7.X.8.Y.9.Z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.", // Example hashed password for 'password123'
      bio: "A movie enthusiast.",
      avatar_url: "https://example.com/avatar1.jpg",
    })
    .returning("*");

  const [user2] = await knex("users")
    .insert({
      username: "jane_smith",
      email: "jane@example.com",
      password_hash:
        "$2a$10$y.XbZgM/PzQx.u.q.V.Q.l.g.O.r.S.y.Z.2.V.4.N.5.O.r.L.t.V.6.W.7.X.8.Y.9.Z.a.b.c.d.e.f.g.h.i.j.k.l.m.n.o.p.q.r.s.t.u.v.w.x.y.z.",
      bio: "Loves anime and sci-fi.",
      avatar_url: "https://example.com/avatar2.jpg",
    })
    .returning("*");

  // Insert genres
  const [actionGenre] = await knex("genres")
    .insert({ name: "Action" })
    .returning("*");
  const [sciFiGenre] = await knex("genres")
    .insert({ name: "Science Fiction" })
    .returning("*");
  const [fantasyGenre] = await knex("genres")
    .insert({ name: "Fantasy" })
    .returning("*");
  const [dramaGenre] = await knex("genres")
    .insert({ name: "Drama" })
    .returning("*");
  const [animeGenre] = await knex("genres")
    .insert({ name: "Anime" })
    .returning("*");

  // Insert movies
  const [movie1] = await knex("movies")
    .insert({
      title: "The Cyberpunk Journey",
      original_title: "Cyberpunk Journey",
      release_year: 2023,
      synopsis: "A thrilling journey through a futuristic cyberpunk city.",
      poster_url: "https://image.tmdb.org/t/p/w500/cyberpunk_poster.jpg",
      trailer_url: "https://www.youtube.com/watch?v=cyberpunk_trailer",
      runtime_minutes: 150,
      type: "movie",
      status: "released",
    })
    .returning("*");

  const [anime1] = await knex("movies")
    .insert({
      title: "Spirit Warrior",
      original_title: "Seishin Senshi",
      release_year: 2022,
      synopsis:
        "An epic anime about a young warrior destined to save the world.",
      poster_url: "https://image.tmdb.org/t/p/w500/spirit_warrior_poster.jpg",
      trailer_url: "https://www.youtube.com/watch?v=spirit_warrior_trailer",
      episode_count: 24,
      type: "anime_tv",
      status: "airing",
    })
    .returning("*");

  // Insert movie_genres
  await knex("movie_genres").insert([
    { movie_id: movie1.movie_id, genre_id: actionGenre.genre_id },
    { movie_id: movie1.movie_id, genre_id: sciFiGenre.genre_id },
    { movie_id: anime1.movie_id, genre_id: animeGenre.genre_id },
    { movie_id: anime1.movie_id, genre_id: fantasyGenre.genre_id },
  ]);

  // Insert reviews
  await knex("reviews").insert([
    {
      user_id: user1.user_id,
      movie_id: movie1.movie_id,
      rating: 8.5,
      comment: "Fantastic cyberpunk movie, great visuals!",
    },
    {
      user_id: user2.user_id,
      movie_id: movie1.movie_id,
      rating: 7.0,
      comment: "Good, but the plot was a bit confusing.",
    },
    {
      user_id: user2.user_id,
      movie_id: anime1.movie_id,
      rating: 9.0,
      comment: "Absolutely loved Spirit Warrior, can't wait for more episodes!",
    },
  ]);

  // Insert watchlists
  await knex("watchlists").insert([
    {
      user_id: user1.user_id,
      movie_id: movie1.movie_id,
      status: "completed",
      current_episode: 1,
    },
    {
      user_id: user1.user_id,
      movie_id: anime1.movie_id,
      status: "plan_to_watch",
      current_episode: 0,
    },
    {
      user_id: user2.user_id,
      movie_id: movie1.movie_id,
      status: "dropped",
      current_episode: 30,
    },
  ]);
};
