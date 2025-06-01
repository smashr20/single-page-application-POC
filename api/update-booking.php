<?php
header("Content-Type: application/json");

require 'db.php';
$conn = OpenCon();

// Read JSON POST data
$data = json_decode(file_get_contents("php://input"), true);
// Extract and sanitize input
$id = $data['id'] ?? null;

$id = $data['id'] ?? null;
$status = $data['status'] ?? null;
$message = trim($data['message'] ?? "");
$senderId = $data['senderId'] ?? null;

// Validate required fields
if (!$id || !$status || !$senderId) {
    http_response_code(400);
    echo json_encode(["error" => "Missing required fields (id, status, senderId)."]);
    exit;
}


// 1. Update booking status
$updateQuery = "UPDATE bookings SET status = ? WHERE id = ?";
$stmt = $conn->prepare($updateQuery);

if (!$stmt) {
    http_response_code(500);
    echo json_encode(["error" => "Failed to prepare status update query."]);
    exit;
}

$stmt->bind_param("si", $status, $id);
$stmt->execute();

if ($stmt->error) {
    http_response_code(500);
    echo json_encode(["error" => "Database error while updating booking."]);
    $stmt->close();
    $conn->close();
    exit;
}
$stmt->close();

// 2. If message sage is provided, insert it
if (!empty($message)) {
    $insertMessageQuery = "INSERT INTO booking_messages (bookingId, senderId, message) VALUES (?, ?, ?)";
    $stmt2 = $conn->prepare($insertMessageQuery);

    if (!$stmt2) {
        http_response_code(500);
        echo json_encode(["error" => "Failed to prepare message insert query."]);
        $conn->close();
        exit;
    }

    $stmt2->bind_param("iis", $id, $senderId, $message);
    $stmt2->execute();

    if ($stmt2->error) {
        http_response_code(500);
        echo json_encode(["error" => "Message save failed."]);
    } else {
        echo json_encode(["message" => "Booking status and message updated."]);
    }

    $stmt2->close();
} else {
    echo json_encode(["message" => "Booking status updated (no message sent)."]);
}

$conn->close();