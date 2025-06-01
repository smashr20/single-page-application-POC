<?php
function OpenCon() {
$dbhost = "wamp-mac-mysql-1";
$dbuser = "root";
$dbpass = "root"; // Default is empty for XAMPP
$dbname = "vocals";
$port = "3306";

$conn = mysqli_connect($dbhost, $dbuser, $dbpass, $dbname, $port);
if ($conn->connect_error) {
die("Connection failed: " . $conn->connect_error);
}
return $conn;
}
function CloseCon($conn) {
$conn->close();
}
?>