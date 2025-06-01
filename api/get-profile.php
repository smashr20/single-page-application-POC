<?php
header("Content-Type: application/json");
require 'db.php'; // 👈 Reuse db connection
$conn = OpenCon();

$input = json_decode(file_get_contents("php://input"), true);

// Check if userId is present
    $id = $input['id'] ?? null;

   if (!$id) {
    http_response_code(400);
    echo json_encode(["error" => "Missing password or email"]);
    exit;
}


// Prepared statement
$stmt = $conn->prepare("SELECT id, name, address, country, state, postcode, mobile, email, website, role, profilePhoto FROM users WHERE id  = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();
//$user = $result();
$user = $result->fetch_assoc();

if ($user) {
    echo json_encode(["user"=>$user]);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'User not found']);
}

$stmt->close();
$conn->close();

