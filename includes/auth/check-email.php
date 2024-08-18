<?php
require_once '../db.php';
require_once '../functions.php';

$conn = getConnection();

if (isset($_POST['email'])) {
    $email = $_POST['email'];
    $email = sanitizeInput($email);
    $query = "SELECT id FROM _emails WHERE email = '$email'";
    $result = mysqli_query($conn, $query);
    if (mysqli_num_rows($result) > 0) {
        echo json_encode(['success' => false]);
    } else {
        echo json_encode(['success' => true]);
    }
} else {
    echo json_encode(['success' => false]);
}
