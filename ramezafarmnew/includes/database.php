<?php

declare(strict_types=1);

/**
 * Koneksi database (PDO) untuk fitur ulasan.
 *
 * Konfigurasi default cocok untuk XAMPP lokal:
 * - host: 127.0.0.1
 * - port: 3306
 * - dbname: ramezafarm_db
 * - username: root
 * - password: ''
 *
 * Bisa dioverride lewat environment variable:
 * DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS
 */
function getDatabaseConnection(): PDO
{
    static $pdo = null;

    if ($pdo instanceof PDO) {
        return $pdo;
    }

    $host = getenv('DB_HOST') ?: '127.0.0.1';
    $port = getenv('DB_PORT') ?: '3306';
    $dbName = getenv('DB_NAME') ?: 'ramezafarm_db';
    $dbUser = getenv('DB_USER') ?: 'root';
    $dbPass = getenv('DB_PASS') ?: '';

    $dsn = "mysql:host={$host};port={$port};dbname={$dbName};charset=utf8mb4";

    $pdo = new PDO($dsn, $dbUser, $dbPass, [
        PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES => false,
    ]);

    return $pdo;
}

/**
 * Simpan ulasan baru (default status pending).
 * Return: ID ulasan baru.
 */
function createReview(array $reviewData): int
{
    $pdo = getDatabaseConnection();

    $nama = trim((string) ($reviewData['nama'] ?? ''));
    $email = trim((string) ($reviewData['email'] ?? ''));
    $rating = (int) ($reviewData['rating'] ?? 0);
    $judul = trim((string) ($reviewData['judul'] ?? ''));
    $isi = trim((string) ($reviewData['isi'] ?? ''));

    if ($nama === '' || $isi === '' || $rating < 1 || $rating > 5) {
        throw new InvalidArgumentException('Data ulasan tidak valid.');
    }

    $stmt = $pdo->prepare(
        'INSERT INTO ulasan (nama, email, rating, judul, isi)
         VALUES (:nama, :email, :rating, :judul, :isi)'
    );

    $stmt->execute([
        ':nama' => $nama,
        ':email' => $email !== '' ? $email : null,
        ':rating' => $rating,
        ':judul' => $judul !== '' ? $judul : null,
        ':isi' => $isi,
    ]);

    return (int) $pdo->lastInsertId();
}

/**
 * Ambil ulasan yang sudah diset untuk ditampilkan.
 */
function getPublishedReviews(int $limit = 10): array
{
    $pdo = getDatabaseConnection();

    $limit = max(1, min($limit, 100));

    $stmt = $pdo->prepare(
        "SELECT id, nama, rating, judul, isi, created_at
         FROM ulasan
         WHERE status = 'ditampilkan'
         ORDER BY created_at DESC
         LIMIT {$limit}"
    );

    $stmt->execute();

    return $stmt->fetchAll();
}