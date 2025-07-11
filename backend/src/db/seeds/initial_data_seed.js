// seeds/initial_data_seed.js
// --- CHANGE THIS LINE ---
// Instead of: const { faker } = require("@faker-js/faker");
// Use:
const { faker } = require("@faker-js/faker/locale/en"); // Import faker with English locale directly
// --- END CHANGE ---

const bcrypt = require("bcrypt"); // Cần cài đặt: npm install bcrypt

// --- REMOVE THIS LINE ---
// faker.setLocale("en_US"); // This line is no longer needed and causes the error
// --- END REMOVE ---

exports.seed = async function (knex) {
  // Xóa dữ liệu cũ (theo thứ tự ngược lại của quan hệ khóa ngoại)
  await knex("watchlists").del();
  await knex("reviews").del();
  await knex("movie_genres").del();
  await knex("movies").del();
  await knex("genres").del();
  await knex("users").del();

  const numRecords = 50; // Số lượng bản ghi tổng thể
  const users = [];
  const genres = [];
  const movies = [];
  const movieGenres = [];
  const reviews = [];
  const watchlists = [];

  // --- USERS ---
  console.log("Generating users...");
  for (let i = 0; i < numRecords; i++) {
    const password = faker.internet.password();
    const passwordHash = await bcrypt.hash(password, 10);

    users.push({
      username: faker.internet.userName().slice(0, 50),
      email: faker.internet.email().slice(0, 100),
      password_hash: passwordHash,
      bio: faker.lorem.paragraph().slice(0, 255),
      avatar_url: faker.image.avatar(),
      role: i === 0 ? "admin" : "user",
    });
  }

  await knex("users").insert(users);
  const createdUsers = await knex("users").select("user_id", "username");
  console.log(`Created ${createdUsers.length} users.`);

  // --- GENRES ---
  console.log("Generating genres...");
  const genreNames = [
    "Action",
    "Comedy",
    "Drama",
    "Sci-Fi",
    "Fantasy",
    "Horror",
    "Thriller",
    "Romance",
    "Adventure",
    "Animation",
    "Documentary",
    "Family",
    "Musical",
    "Mystery",
    "Sport",
    "War",
    "Crime",
    "Biography",
    "History",
    "Western",
    "Anime", // Thể loại Anime
    "Classic", // Thêm thể loại Classic
    "Kids",
  ];
  for (const name of genreNames) {
    genres.push({ name });
  }
  await knex("genres").insert(genres);
  const createdGenres = await knex("genres").select("genre_id", "name");
  const animeGenre = createdGenres.find((g) => g.name === "Anime");
  const classicGenre = createdGenres.find((g) => g.name === "Classic");
  console.log(`Created ${createdGenres.length} genres.`);

  // --- MOVIES ---
  console.log("Generating movies...");
  const movieTypes = ["movie", "tv_series"]; // Chỉ bao gồm movie và tv_series
  const movieStatuses = ["released", "airing", "upcoming", "cancelled"];

  for (let i = 0; i < numRecords; i++) {
    const type = faker.helpers.arrayElement(movieTypes);
    const episodeCount =
      type === "tv_series" ? faker.number.int({ min: 1, max: 100 }) : 1;

    // Để tạo phim kinh điển, chọn năm phát hành cũ hơn
    const isClassic = faker.datatype.boolean(0.3); // 30% khả năng là phim kinh điển
    const releaseYear = isClassic
      ? faker.number.int({ min: 1950, max: 1999 }) // Năm cũ hơn cho phim kinh điển
      : faker.number.int({ min: 2000, max: 2025 }); // Năm gần đây hơn

    movies.push({
      title: faker.lorem.words({ min: 2, max: 5 }).slice(0, 255),
      original_title: faker.lorem.words({ min: 2, max: 5 }).slice(0, 255),
      release_year: releaseYear,
      synopsis: faker.lorem.paragraphs({ min: 1, max: 3 }),
      poster_url: faker.image.urlLoremFlickr({ category: "movie" }),
      trailer_url: `http://googleusercontent.com/youtube.com/${faker.string.alphanumeric(
        11
      )}`,
      runtime_minutes: faker.number.int({ min: 60, max: 240 }),
      episode_count: episodeCount,
      status: faker.helpers.arrayElement(movieStatuses),
      type,
      average_rating: faker.number.float({
        min: 0.0,
        max: 10.0,
        precision: 0.1,
      }),
      rating_count: faker.number.int({ min: 0, max: 10000 }),
    });
  }

  await knex("movies").insert(movies);
  const createdMovies = await knex("movies").select(
    "movie_id",
    "title",
    "type",
    "episode_count"
  );
  console.log(`Created ${createdMovies.length} movies.`);

  // --- MOVIE_GENRES ---
  console.log("Generating movie_genres...");
  for (const movie of createdMovies) {
    const numGenres = faker.number.int({ min: 1, max: 3 });
    let selectedGenres = faker.helpers.arrayElements(
      createdGenres.filter((g) => g.name !== "Anime" && g.name !== "Classic"), // Loại bỏ Anime và Classic để thêm thủ công
      numGenres
    );

    // Thêm thể loại "Anime" cho một số phim ngẫu nhiên
    const isAnimeMovie = faker.datatype.boolean(0.2); // 20% khả năng là phim Anime
    if (isAnimeMovie && animeGenre) {
      if (!selectedGenres.some((g) => g.genre_id === animeGenre.genre_id)) {
        selectedGenres.push(animeGenre);
      }
    }

    // Thêm thể loại "Classic" cho phim kinh điển
    if (movie.release_year < 2000 && classicGenre) {
      if (!selectedGenres.some((g) => g.genre_id === classicGenre.genre_id)) {
        selectedGenres.push(classicGenre);
      }
    }

    // Đảm bảo không có genre trùng lặp
    const uniqueSelectedGenres = Array.from(
      new Set(selectedGenres.map((g) => g.genre_id))
    ).map((id) => selectedGenres.find((g) => g.genre_id === id));

    for (const genre of uniqueSelectedGenres) {
      movieGenres.push({
        movie_id: movie.movie_id,
        genre_id: genre.genre_id,
      });
    }
  }
  await knex("movie_genres").insert(movieGenres);
  console.log(`Created ${movieGenres.length} movie_genres.`);

  // --- REVIEWS ---
  console.log("Generating reviews...");
  const reviewPairs = new Set();
  for (const movie of createdMovies) {
    const numReviews = faker.number.int({ min: 0, max: 5 });
    const reviewers = faker.helpers.arrayElements(createdUsers, numReviews);

    for (const user of reviewers) {
      const key = `${user.user_id}_${movie.movie_id}`;
      if (!reviewPairs.has(key)) {
        reviewPairs.add(key);
        reviews.push({
          user_id: user.user_id,
          movie_id: movie.movie_id,
          rating: faker.number.float({ min: 0.0, max: 10.0, precision: 0.1 }),
          comment: faker.lorem.sentence(),
        });
      }
    }
  }

  try {
    await knex("reviews").insert(reviews);
    console.log(`Created ${reviews.length} reviews.`);
  } catch (error) {
    console.warn("Review insertion failed:", error.message);
  }

  // --- WATCHLISTS ---
  console.log("Generating watchlists...");
  const watchlistPairs = new Set();
  const watchlistStatuses = [
    "watching",
    "completed",
    "plan_to_watch",
    "dropped",
  ];

  for (const user of createdUsers) {
    const numWatchlists = faker.number.int({ min: 0, max: 10 });
    const selectedMovies = faker.helpers.arrayElements(
      createdMovies,
      numWatchlists
    );

    for (const movie of selectedMovies) {
      const key = `${user.user_id}_${movie.movie_id}`;
      if (!watchlistPairs.has(key)) {
        watchlistPairs.add(key);
        watchlists.push({
          user_id: user.user_id,
          movie_id: movie.movie_id,
          status: faker.helpers.arrayElement(watchlistStatuses),
          current_episode: faker.number.int({
            min: 0,
            max: movie.episode_count || 1,
          }),
          added_at: faker.date.recent({ days: 365 }),
          updated_at: faker.date.recent({ days: 30 }),
        });
      }
    }
  }

  try {
    await knex("watchlists").insert(watchlists);
    console.log(`Created ${watchlists.length} watchlists.`);
  } catch (error) {
    console.warn("Watchlist insertion failed:", error.message);
  }

  console.log("✅ Seed data generation complete!");
};
