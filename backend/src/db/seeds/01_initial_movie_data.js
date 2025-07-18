const axios = require("axios");

// --- CẤU HÌNH ---
const TMDB_API_KEY = "16010a745e20b55055b922039125b20b";
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const PAGES_TO_FETCH = 5;
// --- KẾT THÚC CẤU HÌNH ---

const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: { api_key: TMDB_API_KEY, language: "vi-VN" },
});

async function prepareDatabase(knex) {
  console.log("Xóa dữ liệu cũ...");
  await knex("movie_genres").del();
  await knex("movies").del();
  await knex("genres").del();

  console.log("Đang lấy và lưu trữ các thể loại (genres)...");
  const {
    data: { genres: movieGenres },
  } = await tmdbApi.get("/genre/movie/list");
  const {
    data: { genres: tvGenres },
  } = await tmdbApi.get("/genre/tv/list");
  const allGenres = [...movieGenres, ...tvGenres];
  const uniqueGenres = Array.from(
    new Map(allGenres.map((item) => [item.name, item])).values()
  );
  await knex("genres").insert(uniqueGenres.map((g) => ({ name: g.name })));
}

async function processMedia(
  knex,
  mediaType,
  endpoint,
  additionalParams,
  genresMaps
) {
  const { genreNameToIdMap } = genresMaps;

  console.log(
    `\nBắt đầu lấy dữ liệu cho: ${mediaType.toUpperCase()} từ endpoint ${endpoint} với params ${JSON.stringify(
      additionalParams
    )}...`
  );

  for (let page = 1; page <= PAGES_TO_FETCH; page++) {
    console.log(`- Xử lý trang ${page}...`);
    try {
      const {
        data: { results: mediaList },
      } = await tmdbApi.get(endpoint, {
        params: { page, ...additionalParams },
      });

      for (const mediaItem of mediaList) {
        const { data: details } = await tmdbApi.get(
          `/${mediaType}/${mediaItem.id}`,
          {
            params: { append_to_response: "videos" },
          }
        );

        if (!details.overview || !details.poster_path) continue;

        // --- LOGIC TÌM KIẾM TRAILER NÂNG CAO ---
        const videos = details.videos?.results || [];
        let trailer = null;

        // 1. Tạo danh sách ưu tiên các loại video
        const priorityTypes = [
          "Trailer",
          "Teaser",
          "Clip",
          "Featurette",
          "Opening",
        ];

        // 2. Tìm video theo thứ tự ưu tiên
        for (const type of priorityTypes) {
          trailer = videos.find((v) => v.site === "YouTube" && v.type === type);
          if (trailer) break; // Nếu tìm thấy, dừng vòng lặp
        }

        // 3. Nếu vẫn không tìm thấy, lấy video YouTube đầu tiên có trong danh sách
        if (!trailer) {
          trailer = videos.find((v) => v.site === "YouTube");
        }

        // 4. Tạo URL hoàn chỉnh (định dạng URL đã được sửa lại cho đúng)
        const trailerUrl = trailer
          ? `https://www.youtube.com/watch?v=${trailer.key}`
          : null;
        // --- KẾT THÚC LOGIC TÌM KIẾM TRAILER ---

        const allowedStatus = ["released", "airing", "upcoming", "cancelled"];
        let currentStatus = (details.status || "released").toLowerCase();
        if (currentStatus === "returning series") currentStatus = "airing";
        else if (!allowedStatus.includes(currentStatus))
          currentStatus = "released";

        const newItem = {
          tmdb_id: details.id,
          title: details.title || details.name,
          original_title: details.original_title || details.original_name,
          release_date: details.release_date || details.first_air_date || null,
          synopsis: details.overview,
          poster_url: `${IMAGE_BASE_URL}${details.poster_path}`,
          trailer_url: trailerUrl, // <-- Dữ liệu trailer tốt hơn
          runtime_minutes:
            details.runtime ||
            (details.episode_run_time && details.episode_run_time[0]) ||
            null,
          episode_count: details.number_of_episodes || 1,
          type: mediaType === "movie" ? "movie" : "tv_series",
          status: currentStatus,
          average_rating: details.vote_average,
          rating_count: details.vote_count,
        };

        await knex.transaction(async (trx) => {
          const [insertedItem] = await trx("movies")
            .insert(newItem)
            .onConflict("tmdb_id")
            .ignore()
            .returning("movie_id");
          if (!insertedItem) return;

          const newId = insertedItem.movie_id || insertedItem;

          const genreLinks = (details.genres || [])
            .map((genre) => {
              const internalId = genreNameToIdMap.get(genre.name);
              if (internalId) return { movie_id: newId, genre_id: internalId };
              return null;
            })
            .filter(Boolean);

          if (genreLinks.length > 0) {
            await trx("movie_genres")
              .insert(genreLinks)
              .onConflict(["movie_id", "genre_id"])
              .ignore();
          }
        });
      }
      await new Promise((res) => setTimeout(res, 500));
    } catch (error) {
      console.warn(
        `Lỗi khi lấy trang ${page} từ ${endpoint}. Lỗi: ${error.message}. Bỏ qua...`
      );
    }
  }
}

exports.seed = async function (knex) {
  await prepareDatabase(knex);

  const genresInDb = await knex("genres").select("genre_id", "name");
  const genreNameToIdMap = new Map(genresInDb.map((g) => [g.name, g.genre_id]));
  const genresMaps = { genreNameToIdMap };

  // Phim Điện ảnh
  await processMedia(knex, "movie", "/movie/popular", {}, genresMaps);
  await processMedia(knex, "movie", "/movie/top_rated", {}, genresMaps);

  // Phim Bộ
  await processMedia(knex, "tv", "/tv/popular", {}, genresMaps);
  await processMedia(knex, "tv", "/tv/top_rated", {}, genresMaps);

  // Anime
  const animeParams = { with_genres: "16", with_origin_country: "JP" };
  await processMedia(knex, "tv", "/discover/tv", animeParams, genresMaps);

  console.log(
    "✅ Hoàn tất seed dữ liệu chi tiết cho phim, TV series và Anime."
  );
};
