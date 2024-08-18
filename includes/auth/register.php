<?php

$errors = [];

if (!empty(array_filter($_POST))) {
    var_dump($_POST);

    // todo:
    // shorten username to max size as defined in db and input field
    // add link to login page if username/email is already in use and autofill username/email input
    // update h1 header to show current step

    if ($password !== $revisePassword) {
        $errors[] = "Passwords do not match.";
    } else {
        // // Generate a verification token
        // $token = bin2hex(random_bytes(16));

        // // Insert user into the database with the verification token
        // $query = "INSERT INTO users (username, email, password, token, is_verified) VALUES ('$username', '$email', '$password', '$token', 0)";
        // if (mysqli_query($conn, $query)) {
        //     // Send verification email
        //     $verificationLink = "http://loclhost/verify.php?token=$token";
        //     $subject = "Email Verification";
        //     $message = "Click the link below to verify your email:\n$verificationLink";
        //     $headers = "From: no-reply@yourdomain.com";

        //     if (mail($email, $subject, $message, $headers)) {
        //         echo "A verification email has been sent to your email address.";
        //     } else {
        //         $errors[] = "Failed to send verification email.";
        //     }
        // } else {
        //     $errors[] = "Registration failed.";
        // }
    }
} else {
    $errors[] = "All fields are required.";
}

?>
<div class="auth-page-container">

    <h1>Register</h1>

    <form class="auth-form" id="register-form" action="/" method="POST">
        <div class="user-input-area user-input-area-register active" id="register-username">
            <input class="text-input auth-item" id="register-username-input" type="text" name="username" placeholder="Username" maxlength="16">
            <button class="auth-item auth-btn button-register" id="register-username-btn" type="button" disabled>Continue</button>
        </div>

        <div class="user-input-area user-input-area-register" id="register-email">
            <input class="text-input auth-item" id="register-email-input" type="email" name="email" placeholder="Email">
            <button class="auth-item auth-btn button-register" id="register-email-btn" type="button" disabled>Continue</button>
        </div>

        <div class="user-input-area user-input-area-register" id="verify-email">
            <button class="auth-item auth-btn" id="send-verif-code-btn" type="button">Send Code</button>
            <input class="text-input auth-item" id="verif-code-input" type="text" name="verif-code" placeholder="Code from Email">
            <button class="auth-item auth-btn button-register" id="verify-email-btn" type="button" disabled>Continue</button>
        </div>

        <div class="user-input-area user-input-area-register" id="register-password">
            <input class="text-input auth-item" id="register-password-input" type="password" name="password" placeholder="Password">
            <input class="text-input auth-item" id="register-revise-password-input" type="password" name="revise-password" placeholder="Revise password">
            <input class="auth-item auth-btn" type="submit" value="Submit" disabled>
        </div>

        <button class="auth-item auth-btn auth-back-btn" id="register-back-btn" type="button" title="Back">
            <i class="fas fa-arrow-left"></i>
        </button>
    </form>

    <div class="account-message">
        Already have an account? Log in.
    </div>



</div>