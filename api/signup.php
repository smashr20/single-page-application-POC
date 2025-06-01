<?php
header("Content-Type: application/json");

require 'db.php';
$conn = OpenCon();


// Read JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Extract and sanitize input
$name = $data['name'] ?? null;
$address = $data['address'] ?? null;
$country = $data['country'] ?? null;
$state = $data['state'] ?? null;
$postcode = $data['postcode'] ?? null;
$mobile = $data['mobile'] ?? null;
$email = $data['email'] ?? null;
$password = $data['password'] ?? null;
$confirmPassword = $data['confirmPassword'] ?? null;
$website = $data['website'] ?? '';
$role = $data['role'] ?? null;

// Required fields check
if (
    !$name || !$address || !$country || !$state || !$postcode ||
    !$mobile || !$email || !$password || !$confirmPassword || !$role
) {
    http_response_code(400);
    echo json_encode(["error" => "All fields except website are required."]);
    exit;
}

// Password match check
if ($password !== $confirmPassword) {
    http_response_code(400);
    echo json_encode(["error" => "Passwords do not match."]);
    exit;
}

// Role validation
$allowedRoles = ['entertainer', 'bands', 'celebrities', 'services', 'speakers', 'customer', 'admin'];
if (!in_array($role, $allowedRoles)) {
    http_response_code(400);
    echo json_encode(["error" => "Invalid role specified."]);
    exit;
}

// Check for duplicate email
$emailCheck = $conn->prepare("SELECT id FROM users WHERE email = ?");
$emailCheck->bind_param("s", $email);
$emailCheck->execute();
$emailCheck->store_result();

if ($emailCheck->num_rows > 0) {
    http_response_code(409);
    echo json_encode(["error" => "Email already exists."]);
    $emailCheck->close();
    $conn->close();
    exit;
}
$emailCheck->close();

// Insert user
$insertQuery = "
    INSERT INTO users (name, address, country, state, postcode, mobile, email, password, website, role)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
";
$stmt = $conn->prepare($insertQuery);
$stmt->bind_param("ssssssssss", $name, $address, $country, $state, $postcode, $mobile, $email, $password, $website, $role);
if (!$stmt->execute()) {
    http_response_code(500);
    echo json_encode(["error" => "Database error: " . $stmt->error]);
    $stmt->close();
    $conn->close();
    exit;
}

// Get newly inserted user
$newUserId = $stmt->insert_id;
$stmt->close();

$userQuery = $conn->prepare("SELECT id, name, email, role FROM users WHERE id = ?");
$userQuery->bind_param("i", $newUserId);
$userQuery->execute();
$result = $userQuery->get_result();
$user = $result->fetch_assoc();

if (!$user) {
    http_response_code(500);
    echo json_encode(["error" => "User registered but failed to fetch user details."]);
} else {
    http_response_code(201);
    echo json_encode([
        "message" => "User registered successfully.",
        "user" => $user
    ]);
}

$userQuery->close();
$conn->close();
