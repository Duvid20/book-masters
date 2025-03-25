<?php
require_once '../db.php';
require_once '../functions.php';

if (isset($_POST['username'])) {
    $username = $_POST['username'];

    if (isUsernameInUse($username)) {
        echo json_encode(['success' => false]);
    } else {
        echo json_encode(['success' => true]);
    }
} else {
    echo json_encode(['success' => false]);
}
