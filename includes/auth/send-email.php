<?php
if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $to = $_POST['email-to'];
    $subject = $_POST['email-subject'];
    $message = $_POST['email-message'];
    $headers = "From: test@test.com";

    if (mail($to, $subject, $message, $headers)) {
        echo json_encode(['success' => true]);
    } else {
        echo json_encode(['success' => false]);
    }
} else {
    echo json_encode(['success' => false]);
}
