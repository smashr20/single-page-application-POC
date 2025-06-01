<?php
// users.php
header("Content-Type: application/json");
require 'db.php';
$conn = OpenCon();
$method = $_SERVER['REQUEST_METHOD'];
$uri = explode('/', trim($_SERVER['REQUEST_URI'], '/'));
// Simple routing
if ($uri[1] !== 'users.php') {
    http_response_code(404);
    echo json_encode(['error' => 'Not Found']);
    exit;
}
switch ($method) {
    case 'POST':
        // Create user
    $stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", 1);
$stmt->execute();

$result = $stmt->get_result();
$user = $result->fetch_assoc();


    echo json_encode($user);
//        $data = json_decode(file_get_contents("php://input"), true);
  //      $sql = "INSERT INTO users (name, email) VALUES (:name, :email)";
    //    $stmt = $pdo->prepare($sql);
      //  $stmt->execute(['name' => $data['name'], 'email' => $data['email']]);
        //echo json_encode(['id' => $pdo->lastInsertId()]);
        break;

    case 'PUT':
        // Update user
        parse_str(file_get_contents("php://input"), $data);
        $sql = "UPDATE users SET name = :name, email = :email WHERE id = :id";
        $stmt = $pdo->prepare($sql);
        $stmt->execute(['id' => $data['id'], 'name' => $data['name'], 'email' => $data['email']]);
        echo json_encode(['message' => 'User updated']);
        break;

    case 'GET':
        // Fetch user by ID: /users.php?id=1
        $id = $_GET['id'] ?? null;
      if ($id) {
        	// Prepared statement
$stmt = $conn->prepare("SELECT * FROM users WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();

$result = $stmt->get_result();
$user = $result->fetch_assoc();

if ($user) {
    echo json_encode($user);
} else {
    http_response_code(404);
    echo json_encode(['error' => 'User not found']);
}
//header('Content-Type: application/json; charset=utf-8');
//echo json_encode($data);

        } else {
            echo json_encode(['error' => 'User ID required']);
        }
        break;

    default:
        http_response_code(405);
        echo json_encode(['error' => 'Method Not Allowed']);
        break;
}
