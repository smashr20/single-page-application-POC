<?php
require 'db.php'; // 👈 Reuse db connection
$conn = OpenCon();


// Read JSON POST body
$data = json_decode(file_get_contents("php://input"), true);

// Extract and sanitize input
$id = $data['id'] ?? null;
$name = $data['name'] ?? null;
$address = $data['address'] ?? null;
$country = $data['country'] ?? null;
$state = $data['state'] ?? null;
$postcode = $data['postcode'] ?? null;
$mobile = $data['mobile'] ?? null;
$website = $data['website'] ?? "";

// Validate required fields
if (!$id || !$name || !$address || !$country || !$state || !$postcode || !$mobile) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields."]);
    exit;
}



// Prepare update query
$query = "
    UPDATE users 
    SET name = ?, address = ?, country = ?, state = ?, postcode = ?, mobile = ?, website = ?
    WHERE id = ?
";

$stmt = $conn->prepare($query);
if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Query preparation failed."]);
    exit;
}

// Bind parameters
$stmt->bind_param("sssssssi", $name, $address, $country, $state, $postcode, $mobile, $website, $id);

// Execute query
$stmt->execute();

if ($stmt->affected_rows === 0) {
    http_response_code(404);
    echo json_encode(["error" => "User not found or no changes made."]);
} else {
    echo json_encode(["message" => "Profile updated successfully."]);
}

$stmt->close();
$conn->close();

