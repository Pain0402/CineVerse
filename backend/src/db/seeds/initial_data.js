// src/db/seeds/[timestamp]_initial_data.js

// This seed file populates the CineVerse database with initial dummy data.
// It includes users, genres, movies/series, their genre associations,
// user reviews, and user watchlists.

// Note: The password_hash values are placeholders for demonstration.
// In a real application, ensure proper password hashing (e.g., using bcrypt)
// is implemented during user registration and within seed files for production.

exports.seed = async function (knex) {
  // --- 1. Deletes ALL existing entries in reverse dependency order ---
  console.log("Deleting existing data...");
  await knex("watchlists").del();
  await knex("reviews").del();
  await knex("movie_genres").del();
  await knex("movies").del();
  await knex("genres").del();
  await knex("users").del();
  console.log("Existing data deleted.");

  // --- 2. Insert Users ---
  console.log("Inserting users...");
  const usersToInsert = [];
  const commonBio = [
    "A movie enthusiast.",
    "Loves sci-fi and drama.",
    "Big fan of fantasy and adventure.",
    "Always looking for the next great series.",
    "Enjoys independent films.",
    "Action movie aficionado.",
    "Comedy is my go-to!",
  ];
  const commonAvatarBaseUrl = "https://placehold.co/100x100/A0B9C9/000000?text=";

  for (let i = 1; i <= 20; i++) {
    const username = `user_${i}`;
    const email = `user${i}@example.com`;
    // Placeholder hash for 'password123' - REPLACE WITH REAL HASH IN PRODUCTION
    const passwordHash = "$2a$10$abcdefghijklmnopqrstuvwxy.ABCDEFGHIJKLMNO";
    const bio = commonBio[Math.floor(Math.random() * commonBio.length)];
    const avatarUrl = `${commonAvatarBaseUrl}${username.toUpperCase()}`;

    usersToInsert.push({
      username: username,
      email: email,
      password_hash: passwordHash,
      bio: bio,
      avatar_url: avatarUrl,
    });
  }

  const insertedUsers = await knex("users").insert(usersToInsert).returning("*");
  console.log(`Inserted ${insertedUsers.length} users.`);

  // --- 3. Insert Genres ---
  console.log("Inserting genres...");
  const genreNames = [
    "Action", "Adventure", "Comedy", "Drama", "Fantasy",
    "Science Fiction", "Thriller", "Horror", "Romance", "Mystery",
    "Animation", "Documentary", "Family", "Crime", "Historical", "Anime"
  ];
  const genresToInsert = genreNames.map(name => ({ name }));
  const insertedGenres = await knex("genres").insert(genresToInsert).returning("*");
  console.log(`Inserted ${insertedGenres.length} genres.`);

  // Create a map for easy genre lookup by name
  const genreMap = new Map(insertedGenres.map(g => [g.name, g.genre_id]));
  const animeGenreId = genreMap.get("Anime");
  const animationGenreId = genreMap.get("Animation");

  // --- 4. Insert Movies/Series ---
  console.log("Inserting movies/series...");
  const moviesToInsert = [];

  // Add specific Anime entries first
  const specificAnimeEntries = [
    {
      title: "Demon Slayer: Kimetsu no Yaiba",
      original_title: "鬼滅の刃",
      release_year: 2019,
      synopsis: "A boy vows to turn his sister back into a human after a demon attack leaves his family slaughtered and his sister transformed into a demon.",
      poster_url: "https://image.tmdb.org/t/p/w500/demonslayer_poster.jpg",
      trailer_url: "https://www.youtube.com/watch?v=demonslayer_trailer",
      episode_count: 55, // Approx.
      type: "series",
      status: "released",
      production_company: "Ufotable",
      average_rating: 9.1
    },
    {
      title: "Your Name.",
      original_title: "君の名は。",
      release_year: 2016,
      synopsis: "Two strangers find themselves linked in a bizarre way. When a comet approaches, they must find each other to save their world.",
      poster_url: "https://image.tmdb.org/t/p/w500/yourname_poster.jpg",
      trailer_url: "https://www.youtube.com/watch?v=yourname_trailer",
      runtime_minutes: 107,
      type: "movie",
      status: "released",
      production_company: "CoMix Wave Films",
      average_rating: 8.9
    },
    {
      title: "Attack on Titan",
      original_title: "進撃の巨人",
      release_year: 2013,
      synopsis: "After his hometown is destroyed and his mother is killed, young Eren Yeager vows to cleanse the world of the giant humanoid Titans that have brought humanity to the brink of extinction.",
      poster_url: "https://image.tmdb.org/t/p/w500/attackontitan_poster.jpg",
      trailer_url: "https://www.youtube.com/watch?v=attackontitan_trailer",
      episode_count: 88, // Approx.
      type: "series",
      status: "released",
      production_company: "MAPPA",
      average_rating: 9.2
    },
    {
      title: "Spirited Away",
      original_title: "千と千尋の神隠し",
      release_year: 2001,
      synopsis: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, monsters, and spirits, and where humans are changed into beasts.",
      poster_url: "https://image.tmdb.org/t/p/w500/spiritedaway_poster.jpg",
      trailer_url: "https://www.youtube.com/watch?v=spiritedaway_trailer",
      runtime_minutes: 125,
      type: "movie",
      status: "released",
      production_company: "Studio Ghibli",
      average_rating: 8.6
    },
    {
      title: "Fullmetal Alchemist: Brotherhood",
      original_title: "鋼の錬金術師 FULLMETAL ALCHEMIST",
      release_year: 2009,
      synopsis: "Two brothers search for the Philosopher's Stone to restore their bodies after a failed attempt to bring their mother back to life.",
      poster_url: "https://image.tmdb.org/t/p/w500/fullmetal_poster.jpg",
      trailer_url: "https://www.youtube.com/watch?v=fullmetal_trailer",
      episode_count: 64,
      type: "series",
      status: "released",
      production_company: "Bones",
      average_rating: 9.3
    },
    {
      title: "One Punch Man",
      original_title: "ワンパンマン",
      release_year: 2015,
      synopsis: "The story of Saitama, a hero who can defeat any enemy with a single punch but seeks a worthy opponent.",
      poster_url: "https://image.tmdb.org/t/p/w500/onepunchman_poster.jpg",
      trailer_url: "https://www.youtube.com/watch?v=onepunchman_trailer",
      episode_count: 24,
      type: "series",
      status: "released",
      production_company: "Madhouse",
      average_rating: 8.8
    },
    {
      title: "A Silent Voice",
      original_title: "聲の形",
      release_year: 2016,
      synopsis: "A young man is haunted by his past after bullying a deaf girl in elementary school. Years later, he tries to make amends.",
      poster_url: "https://image.tmdb.org/t/p/w500/silentvoice_poster.jpg",
      trailer_url: "https://www.youtube.com/watch?v=silentvoice_trailer",
      runtime_minutes: 130,
      type: "movie",
      status: "released",
      production_company: "Kyoto Animation",
      average_rating: 8.7
    }
  ];
  moviesToInsert.push(...specificAnimeEntries); // Add all specific anime

  const movieTitlesGeneral = [ // Remaining general movie/series titles
    "The Forgotten City", "Echoes of Tomorrow", "Midnight Serenade",
    "Chronicles of Aethel", "Starlight Express", "Whispers in the Dark",
    "Crimson Horizon", "Beyond the Veil", "Ironwood Saga", "Silent Guardian",
    "Pixelated Dreams", "Galactic Odyssey", "Eternal Sands", "Shadows of the Past",
    "Mystic Realms", "The Last Stand", "Quantum Leap", "Forgotten Legacy",
    "Solar Flare", "Ancient Prophecy", "Urban Legends", "Digital Nomad",
    "Through the Looking Glass", "Sapphire Skies", "Cobalt Coast",
    "Emerald Frontier", "Golden Compass", "Silver Lining", "Bronze Shield",
    "Crystal Heart", "Obsidian Gate", "Phantom Falls", "Runic Echoes",
    "Vortex Chronicle", "Zenith Point", "Dragon's Breath", "Elfstone Journey",
    "Gargoyle's Flight", "Phoenix Rising", "Griffin's Call", "Unicorn's Song",
    "Werewolf's Curse", "Vampire's Kiss", "Zombie Apocalypse Now", "Alien Invasion",
    "Robot Uprising", "Time Traveler's Guide", "Parallel Universe", "Lost Civilization"
  ];
  const productionCompaniesGeneral = [
    "Studio Nexus", "CineWorks", "DreamMotion", "Visionary Films", "Epic Creations",
    "FutureScope", "StarDust Productions", "Mystic Arts Studio", "Global Pictures"
  ];
  const statuses = ["released", "in_production", "upcoming"];

  // Insert general movies/series (fewer now, since we added specific anime)
  for (let i = 0; i < 50; i++) { // Reduced from 70 to 50 general entries
    const title = movieTitlesGeneral[i % movieTitlesGeneral.length];
    const type = Math.random() < 0.6 ? "movie" : "series"; // 60% movies, 40% series
    const releaseYear = 2000 + Math.floor(Math.random() * 25); // 2000-2024
    const synopsis = `A captivating ${type} about ${title.toLowerCase().replace(/the /g, '').replace(/ /g, ', ')} and unforeseen challenges.`;
    const posterUrl = `https://placehold.co/300x450/4B0082/FFFFFF?text=${encodeURIComponent(title.replace(/ /g, '\n'))}`;
    const trailerUrl = `https://www.youtube.com/watch?v=sample_trailer_${i}`;
    const status = statuses[Math.floor(Math.random() * statuses.length)];
    const productionCompany = productionCompaniesGeneral[Math.floor(Math.random() * productionCompaniesGeneral.length)];

    const movieEntry = {
      title: title,
      original_title: title, // Simplified for dummy data
      release_year: releaseYear,
      synopsis: synopsis,
      poster_url: posterUrl,
      trailer_url: trailerUrl,
      type: type,
      status: status,
      production_company: productionCompany,
      average_rating: parseFloat((Math.random() * 9 + 1).toFixed(1)) // Score between 1.0 and 10.0
    };

    if (type === "movie") {
      movieEntry.runtime_minutes = 90 + Math.floor(Math.random() * 90); // 90-180 minutes
      movieEntry.episode_count = null; // Ensure null for movies
    } else { // type === "series"
      movieEntry.episode_count = 12 + Math.floor(Math.random() * 24); // 12-35 episodes
      movieEntry.runtime_minutes = null; // Ensure null for series
    }
    moviesToInsert.push(movieEntry);
  }


  const insertedMovies = await knex("movies").insert(moviesToInsert).returning("*");
  console.log(`Inserted ${insertedMovies.length} movies/series.`);

  // --- 5. Insert movie_genres (junction table) ---
  console.log("Inserting movie_genres associations...");
  const movieGenresToInsert = [];
  insertedMovies.forEach(movie => {
    // Assign 1 to 3 random genres to each movie
    const numGenres = 1 + Math.floor(Math.random() * 3);
    const shuffledGenres = insertedGenres.sort(() => 0.5 - Math.random()); // Shuffle genres
    
    const assignedGenreIds = new Set(); // Use a Set to prevent duplicate genre assignments for one movie
    for (let i = 0; i < numGenres; i++) {
        // Ensure we don't assign the same genre twice in the random assignment loop
        if (assignedGenreIds.has(shuffledGenres[i].genre_id)) {
            continue;
        }
        movieGenresToInsert.push({
            movie_id: movie.movie_id,
            genre_id: shuffledGenres[i].genre_id,
        });
        assignedGenreIds.add(shuffledGenres[i].genre_id);
    }

    // Explicitly add 'Animation' and 'Anime' genres if the movie title matches known anime
    const knownAnimeTitles = [
      "Spirit Warrior", "Demon Slayer: Kimetsu no Yaiba", "Your Name.",
      "Attack on Titan", "Spirited Away", "Fullmetal Alchemist: Brotherhood",
      "One Punch Man", "A Silent Voice"
    ];
    if (knownAnimeTitles.includes(movie.title)) {
        if (animationGenreId && !assignedGenreIds.has(animationGenreId)) {
            movieGenresToInsert.push({ movie_id: movie.movie_id, genre_id: animationGenreId });
            assignedGenreIds.add(animationGenreId);
        }
        if (animeGenreId && !assignedGenreIds.has(animeGenreId)) {
            movieGenresToInsert.push({ movie_id: movie.movie_id, genre_id: animeGenreId });
            assignedGenreIds.add(animeGenreId);
        }
    }
  });
  await knex("movie_genres").insert(movieGenresToInsert);
  console.log(`Inserted ${movieGenresToInsert.length} movie_genres associations.`);

  // --- 6. Insert Reviews ---
  console.log("Inserting reviews...");
  const reviewsToInsert = [];
  const reviewComments = [
    "Absolutely loved it! A must-watch.",
    "Fantastic visuals and engaging story.",
    "Enjoyed it, but some parts were a bit slow.",
    "Highly recommended for fans of the genre.",
    "A groundbreaking film, truly unique.",
    "Mediocre, nothing special.",
    "Couldn't finish it, unfortunately.",
    "The acting was superb!",
    "Great concept, poor execution.",
    "Definitely worth a watch.",
  ];

  insertedMovies.forEach(movie => {
    // Each movie gets 0 to 3 reviews
    const numReviews = Math.floor(Math.random() * 4);
    for (let i = 0; i < numReviews; i++) {
      const randomUser = insertedUsers[Math.floor(Math.random() * insertedUsers.length)];
      const rating = (Math.random() * 9 + 1).toFixed(1); // 1.0 - 10.0
      const comment = reviewComments[Math.floor(Math.random() * reviewComments.length)];

      reviewsToInsert.push({
        user_id: randomUser.user_id,
        movie_id: movie.movie_id,
        rating: parseFloat(rating),
        comment: comment,
      });
    }
  });
  await knex("reviews").insert(reviewsToInsert);
  console.log(`Inserted ${reviewsToInsert.length} reviews.`);

  // --- 7. Insert Watchlists ---
  console.log("Inserting watchlists...");
  const watchlistsToInsert = [];
  const watchlistStatuses = ["watching", "completed", "on_hold", "dropped", "plan_to_watch"];

  insertedUsers.forEach(user => {
    // Each user adds 5 to 15 random movies/series to their watchlist
    const numEntries = 5 + Math.floor(Math.random() * 11); // 5-15 entries
    const shuffledMovies = insertedMovies.sort(() => 0.5 - Math.random()); // Shuffle movies for variety

    for (let i = 0; i < numEntries; i++) {
      const movie = shuffledMovies[i];
      const status = watchlistStatuses[Math.floor(Math.random() * watchlistStatuses.length)];
      let currentEpisode = 0;

      if (movie.type === "series" && movie.episode_count && status === "watching") {
        currentEpisode = 1 + Math.floor(Math.random() * movie.episode_count); // Random progress for series
      } else if (movie.type === "movie" && status === "completed") {
        currentEpisode = 1; // Mark as watched for a movie
      }

      watchlistsToInsert.push({
        user_id: user.user_id,
        movie_id: movie.movie_id,
        status: status,
        current_episode: currentEpisode,
      });
    }
  });
  await knex("watchlists").insert(watchlistsToInsert);
  console.log(`Inserted ${watchlistsToInsert.length} watchlist entries.`);

  console.log("Seed complete!");
};
