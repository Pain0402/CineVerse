const { faker } = require("@faker-js/faker");
const bcrypt = require("bcryptjs");

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = async function (knex) {
  // Xóa dữ liệu cũ theo đúng thứ tự phụ thuộc
  await knex("reviews").del();
  await knex("watchlists").del();
  await knex("users").del();

  console.log("Đang tạo người dùng giả...");

  const usersToInsert = [];
  const numberOfUsers = 50;
  const hashedPassword = await bcrypt.hash("password123", 10);

  for (let i = 0; i < numberOfUsers; i++) {
    usersToInsert.push({
      username:
        faker.internet.userName().toLowerCase() +
        faker.number.int({ min: 10, max: 99 }),
      email: faker.internet.email(),
      password_hash: hashedPassword,
      bio: faker.lorem.sentence(),
      avatar_url: faker.image.avatar(),
      role: "user",
    });
  }

  // Thêm một admin user để tiện quản lý
  usersToInsert.push({
    username: "admin",
    email: "admin@example.com",
    password_hash: await bcrypt.hash("adminpassword", 10),
    bio: "Quản trị viên",
    role: "admin",
  });

  await knex("users").insert(usersToInsert);
  console.log(`✅ Đã tạo ${usersToInsert.length} người dùng.`);
};
