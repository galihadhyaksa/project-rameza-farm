<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['message' => 'Metode request tidak diizinkan.']);
    exit;
}

require __DIR__ . '/includes/database.php';

try {
    $nama = trim((string) ($_POST['reviewer_name'] ?? ''));
    $role = trim((string) ($_POST['reviewer_role'] ?? ''));
    $email = trim((string) ($_POST['reviewer_email'] ?? ''));
    $phone = trim((string) ($_POST['reviewer_phone'] ?? ''));
    $rating = (int) ($_POST['rating'] ?? 0);
    $product = trim((string) ($_POST['product_reviewed'] ?? ''));
    $text = trim((string) ($_POST['review_text'] ?? ''));

    if (strlen($nama) < 3) {
        throw new InvalidArgumentException('Nama minimal 3 karakter.');
    }

    if ($role === '') {
        throw new InvalidArgumentException('Pekerjaan/status wajib diisi.');
    }

    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        throw new InvalidArgumentException('Format email tidak valid.');
    }

    if ($phone !== '' && !preg_match('/^[0-9]{10,13}$/', $phone)) {
        throw new InvalidArgumentException('Nomor WhatsApp harus 10-13 digit.');
    }

    if ($rating < 1 || $rating > 5) {
        throw new InvalidArgumentException('Rating tidak valid.');
    }

    if ($product === '') {
        throw new InvalidArgumentException('Produk yang direview wajib dipilih.');
    }

    if (strlen($text) < 20) {
        throw new InvalidArgumentException('Ulasan minimal 20 karakter.');
    }

    $judul = ucwords(str_replace('-', ' ', $product));
    $isi = sprintf(
        "Pekerjaan/Status: %s\nNo. WhatsApp: %s\nProduk: %s\n\n%s",
        $role,
        $phone !== '' ? $phone : '-',
        $judul,
        $text
    );

    $id = createReview([
        'nama' => $nama,
        'email' => $email,
        'rating' => $rating,
        'judul' => $judul,
        'isi' => $isi,
    ]);

    echo json_encode([
        'message' => 'Ulasan berhasil dikirim.',
        'id' => $id,
    ]);
} catch (InvalidArgumentException $exception) {
    http_response_code(422);
    echo json_encode(['message' => $exception->getMessage()]);
} catch (Throwable $exception) {
    http_response_code(500);
    echo json_encode([
        'message' => 'Gagal menyimpan ulasan. Pastikan database sudah dibuat dari database_ulasan.sql.',
    ]);
}
