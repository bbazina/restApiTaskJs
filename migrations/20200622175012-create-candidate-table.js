// 3. BONUS TASK
// - candidate table in the database
// - make a migration for a new table
// - should have first name, last name and date of taking this test as columns
// - POST route /candidate for recording a new candidate in the table specified above

exports.up = function (db) {
  return db.runSql(`
    CREATE TABLE candidate
    (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      test_date DATETIME NOT NULL DEFAULT NOW(),
      first_name VARCHAR(50),
      last_name VARCHAR(50),
      bio TEXT
    )
    ENGINE = InnoDB
    CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci
  `)
}

exports.down = function (db) {
  return db.runSql(`
    DROP TABLE candidate
  `)
}
