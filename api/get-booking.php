<?php
header("Content-Type: application/json");

require 'db.php';
$conn = OpenCon();
// Get raw POST data
$input = json_decode(file_get_contents("php://input"), true);

// Check if userId is present
    $id = $input['id'] ?? null;
$role = $input['role'] ?? null;

   if (!$id || !$role) {
    http_response_code(400);
    echo json_encode(["error" => "Missing id or role"]);
    exit;
}

// 4. Prepare query based on role
$query = "";
$params = [];
$types = "i"; // integer for id

if ($role === "entertainer") {
    $query = "
        SELECT b.id, u.name AS customer, b.bookingDate, b.description, b.status
        FROM bookings b
        JOIN users u ON b.customerId = u.id
        WHERE b.entertainerId = ?
        ORDER BY b.bookingDate DESC
    ";
    $params[] = $id;

} elseif ($role === "customer") {
    $query = "
        SELECT b.id, e.name AS customer, b.bookingDate, b.description, b.status
        FROM bookings b
        JOIN users e ON b.entertainerId = e.id
        WHERE b.customerId = ?
        ORDER BY b.bookingDate DESC
    ";
    $params[] = $id;

} else {
    http_response_code(400);
    echo json_encode(["error" => "Invalid role"]);
    exit;
}

$stmt = $conn->prepare($query);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to prepare query"]);
    exit;
}
$stmt->bind_param($types, ...$params);
$stmt->execute();
$result = $stmt->get_result();

// 6. Fetch results
$bookings = [];
while ($row = $result->fetch_assoc()) {
    $bookings[] = $row;
}

echo json_encode(["bookings" => $bookings]);

$stmt->close();

    // Simulated user data
    