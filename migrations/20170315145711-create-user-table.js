exports.up = function (db) {
  return db.runSql(`
    CREATE TABLE user
    (
      id INT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
      created_at DATETIME NOT NULL DEFAULT NOW(),
      email VARCHAR(254) NOT NULL,
      password VARCHAR(64) NOT NULL,
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
    DROP TABLE user
  `)
}
