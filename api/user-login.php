<?php
header("Content-Type: application/json");

require 'db.php';
$conn = OpenCon();
// Get raw POST data
$input = json_decode(file_get_contents("php://input"), true);

// Check if userId is present
    $email = $input['email'] ?? null;
$password = $input['password'] ?? null;

   if (!$password || !$password) {
    http_response_code(400);
    echo json_encode(["error" => "Missing password or email"]);
    exit;
}

// 4. Prepare query based on role
$query = "";
$params = [];
$types = "i"; // integer for id
$query = "SELECT id, name, email, role FROM users WHERE email = ? AND password = ?";

$stmt = $conn->prepare($query);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to prepare query"]);
    exit;
}
$stmt->bind_param("ss", $email, $password); // s = string
$stmt->execute();
$result = $stmt->get_result();

// 6. Fetch results
if ($user = $result->fetch_assoc()) {
    echo json_encode(["message" => "Login successful", "user" => $user]);
} else {
    http_response_code(401);
    echo json_encode(["success" => false, "error" => "Invalid credentials"]);
}

$stmt->close();
    // Simulated user data
    