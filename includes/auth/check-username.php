<?php
require_once '../db.php';
$conn = getConnection();

if (isset($_POST['username'])) {

    $username = $_POST['username'];
    $query = "SELECT id FROM _users WHERE username = '$username'";
    $result = mysqli_query($conn, $query);
    if (mysqli_num_rows($result) > 0) {
        echo json_encode(['success' => false, 'message' => 'Username is already in use.']);
    } else {
        echo json_encode(['success' => true]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'No username provided.']);
}
