CREATE DATABASE IF NOT EXISTS ramezafarm_db
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE ramezafarm_db;

CREATE TABLE IF NOT EXISTS ulasan (
  id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  nama VARCHAR(100) NOT NULL,
  email VARCHAR(150) DEFAULT NULL,
  rating TINYINT UNSIGNED NOT NULL,
  judul VARCHAR(150) DEFAULT NULL,
  isi TEXT NOT NULL,
  status ENUM('pending', 'ditampilkan', 'ditolak') NOT NULL DEFAULT 'pending',
  is_verified TINYINT(1) NOT NULL DEFAULT 0,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CHECK (rating BETWEEN 1 AND 5),
  INDEX idx_ulasan_status (status),
  INDEX idx_ulasan_created_at (created_at),
  INDEX idx_ulasan_rating (rating)
) ENGINE=InnoDB;

INSERT INTO ulasan (nama, email, rating, judul, isi, status, is_verified)
VALUES
  ('Budi Santoso', 'budi@example.com', 5, 'Telur Sangat Segar', 'Kualitas telurnya bagus, bersih, dan pengiriman cepat.', 'ditampilkan', 1),
  ('Siti Aminah', 'siti@example.com', 4, 'Pelayanan Ramah', 'Respon cepat dan harga sesuai kualitas.', 'ditampilkan', 1);
