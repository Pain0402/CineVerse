// file: seeds/01_initial_movie_data.js

const axios = require("axios");

// --- CẤU HÌNH ---
const TMDB_API_KEY = "16010a745e20b55055b922039125b20b"; // <<<< THAY API KEY CỦA BẠN VÀO ĐÂY
const TMDB_BASE_URL = "https://api.themoviedb.org/3";
const IMAGE_BASE_URL = "https://image.tmdb.org/t/p/w500";
const PAGES_TO_FETCH = 5; // Lấy 5 trang dữ liệu phim (mỗi trang ~20 phim)
// --- KẾT THÚC CẤU HÌNH ---

// Hàm helper để gọi API TMDB
const tmdbApi = axios.create({
  baseURL: TMDB_BASE_URL,
  params: {
    api_key: TMDB_API_KEY,
    language: "vi-VN", // Ưu tiên lấy dữ liệu tiếng Việt
  },
});

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  try {
    console.log("Bắt đầu quá trình seed dữ liệu phim...");

    // Bước 1: Xóa dữ liệu cũ để tránh trùng lặp.
    // Phải xóa theo đúng thứ tự để không vi phạm khóa ngoại.
    console.log("Xóa dữ liệu cũ...");
    await knex("movie_genres").del();
    await knex("reviews").del();
    await knex("watchlists").del();
    await knex("movies").del();
    await knex("genres").del();

    // Bước 2: Lấy và lưu các thể loại (Genres)
    console.log("Đang lấy và lưu trữ các thể loại (genres)...");
    const {
      data: { genres: genresFromApi },
    } = await tmdbApi.get("/genre/movie/list");

    // Ánh xạ dữ liệu genres từ TMDB API vào cấu trúc bảng `genres`
    // Ở đây chúng ta thêm tmdb_id để dễ dàng map sau này
    const genresToInsert = genresFromApi.map((genre) => ({
      name: genre.name,
      // Chúng ta sẽ thêm một cột `tmdb_genre_id` vào bảng genres để dễ map
      // Nếu bạn không muốn thay đổi schema, bạn phải query lại để lấy `genre_id` sau khi insert
    }));

    await knex("genres").insert(genresToInsert);
    console.log(`Đã thêm ${genresFromApi.length} thể loại.`);

    // Tạo một map để dễ dàng truy xuất `genre_id` của bạn từ `name`
    const genresInDb = await knex("genres").select("genre_id", "name");
    const genreNameToIdMap = new Map(
      genresInDb.map((g) => [g.name, g.genre_id])
    );

    // Tạo map từ TMDB genre_id sang tên để dùng cho phim
    const tmdbGenreIdToNameMap = new Map(
      genresFromApi.map((g) => [g.id, g.name])
    );

    // Bước 3: Lấy và lưu các bộ phim (Movies)
    console.log(`Đang lấy dữ liệu phim từ ${PAGES_TO_FETCH} trang...`);
    let allMoviesToInsert = [];
    let allMovieGenreLinks = [];

    for (let page = 1; page <= PAGES_TO_FETCH; page++) {
      console.log(`- Đang xử lý trang ${page}...`);
      const {
        data: { results: moviesFromApi },
      } = await tmdbApi.get("/movie/popular", {
        params: { page },
      });

      for (const movie of moviesFromApi) {
        // Chỉ lấy những phim có đủ thông tin cơ bản
        if (!movie.overview || !movie.release_date) continue;

        // Thêm phim vào danh sách chờ insert
        const newMovie = {
          // movie_id sẽ được tự tạo bằng UUID
          title: movie.title,
          original_title: movie.original_title,
          release_year: parseInt(movie.release_date.substring(0, 4)),
          synopsis: movie.overview,
          poster_url: movie.poster_path
            ? `${IMAGE_BASE_URL}${movie.poster_path}`
            : null,
          // Bạn có thể thêm logic để lấy trailer_url nếu cần
          average_rating: movie.vote_average,
          rating_count: movie.vote_count,
          type: "movie", // Mặc định là movie vì ta đang lấy từ endpoint /movie/popular
          // Thêm tmdb_id vào schema của bạn là một ý tưởng RẤT TỐT để đồng bộ sau này
          // tmdb_id: movie.id
        };

        // Dùng transaction để đảm bảo cả movie và movie_genres đều được thêm
        await knex.transaction(async (trx) => {
          // Chèn phim và lấy ra movie_id vừa được tạo
          const [insertedMovie] = await trx("movies")
            .insert(newMovie)
            .returning("movie_id");
          const newId = insertedMovie.movie_id || insertedMovie; // Tương thích với các CSDL khác nhau

          // Xử lý liên kết movie-genre
          const genreLinksForThisMovie = movie.genre_ids
            .map((tmdbGenreId) => {
              const genreName = tmdbGenreIdToNameMap.get(tmdbGenreId);
              const internalGenreId = genreNameToIdMap.get(genreName);
              if (internalGenreId) {
                return {
                  movie_id: newId,
                  genre_id: internalGenreId,
                };
              }
              return null;
            })
            .filter(Boolean); // Lọc ra các giá trị null

          if (genreLinksForThisMovie.length > 0) {
            await trx("movie_genres").insert(genreLinksForThisMovie);
          }
        });
      }
      // Thêm một khoảng nghỉ nhỏ để không spam API
      await new Promise((res) => setTimeout(res, 250));
    }

    console.log("✅ Quá trình seed dữ liệu đã hoàn tất thành công!");
  } catch (error) {
    console.error("❌ Đã xảy ra lỗi trong quá trình seed dữ liệu:");
    console.error(error);
  }
};
