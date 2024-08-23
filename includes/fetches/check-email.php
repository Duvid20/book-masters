<?php
require_once '../db.php';

if (isset($_POST['email'])) {
    $email = $_POST['email'];

    if (isEmailInUse($email)) {
        echo json_encode(['success' => false]);
    } else {
        echo json_encode(['success' => true]);
    }
} else {
    echo json_encode(['success' => false]);
}
