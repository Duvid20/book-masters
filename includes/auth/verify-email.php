<?php
require_once 'functions.php';
require_once 'db.php';

if (isset($_GET['token'])) {
    $token = $_GET['token'];

    // Verify the token
    $query = "SELECT id FROM users WHERE token = '$token' AND is_verified = 0";
    $result = mysqli_query($conn, $query);

    if (mysqli_num_rows($result) === 1) {
        // Activate the user's account
        $query = "UPDATE users SET is_verified = 1, token = NULL WHERE token = '$token'";
        if (mysqli_query($conn, $query)) {
            echo "Your email has been verified. You can now <a href='login.php'>log in</a>.";
        } else {
            echo "Failed to verify email.";
        }
    } else {
        echo "Invalid or expired token.";
    }
} else {
    echo "No token provided.";
}
