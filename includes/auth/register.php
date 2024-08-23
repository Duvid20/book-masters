<?php

if (!empty(array_filter($_POST))) {
    // var_dump($_POST);

    $givenName = $_POST['given-name'];
    $familyName = $_POST['family-name'];
    $username = $_POST['username'];
    $password = $_POST['password'];
    $email = $_POST['email'];

    $isUsernameInUse = isUsernameInUse($username);
    $isEmailInUse = isEmailInUse($email);

    if (!$isUsernameInUse && !$isEmailInUse) {
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        $sql = "INSERT INTO _users (given_name, family_name, username, password) VALUES (?, ?, ?, ?)";
        $result = executeSQL($sql, [$givenName, $familyName, $username, $hashedPassword]);

        $sql = "SELECT id FROM _users WHERE username = ?";
        $result = executeSQL($sql, [$username]);
        $id = $result[0]['id'];

        $sql = "INSERT INTO _emails (email, f_id_user) VALUES (?, ?)";
        $result = executeSQL($sql, [$email, $id]);

        $_SESSION['username'] = $username;
        $_SESSION['email'] = $email;
        $_SESSION['to_login'] = true;

        redirect('index.php');
        exit();
    }

    // todo:
    // when prefilling username or email, prefer the one that already exists
    // trigger continue button on enter-key press
    // only allow continue buttons triggering with keyboard keys if button is active
    // error handling of sql queries: error page with error message
}

?>
<div class="auth-page-container">
    <div class="auth-header">Register</div>
    <div class="auth-sub-header" id="register-sub-header">Choose your username</div>

    <form class="auth-form" id="register-form" action="/" method="POST">
        <div class="user-input-area user-input-area-register active" id="register-username">
            <input class="text-input auth-item auth-item-medium" id="register-username-input" type="text" name="username" placeholder="Username" maxlength="16" autocomplete="username">
            <button class="auth-item auth-btn button-register auth-item-medium" id="register-username-btn" type="button" disabled>Continue</button>
        </div>

        <div class="user-input-area user-input-area-register" id="register-email">
            <input class="text-input auth-item auth-item-large" id="register-email-input" type="email" name="email" placeholder="Email" autocomplete="email">
            <button class="auth-item auth-btn button-register auth-item-medium" id="register-email-btn" type="button" disabled>Continue</button>
        </div>

        <div class="user-input-area user-input-area-register" id="verify-email">
            <button class="auth-item auth-btn auth-item-medium" id="send-verif-code-btn" type="button">Send Code</button>
            <input class="text-input auth-item auth-item-medium" id="verif-code-input" type="text" name="verif-code" placeholder="Code from Email">
            <button class="auth-item auth-btn button-register auth-item-medium" id="verify-email-btn" type="button">Continue/Skip</button>
        </div>

        <div class="user-input-area user-input-area-register" id="register-password">
            <input class="text-input auth-item auth-item-medium" id="register-password-input" type="password" name="password" placeholder="Password" maxlength="20">
            <input class="text-input auth-item auth-item-medium" id="register-password-confirm-input" type="password" name="password-confirm" placeholder="Confirm password" maxlength="20">
            <button class="auth-item auth-btn button-register auth-item-medium" id="register-password-btn" type="button" disabled>Continue</button>
        </div>

        <div class="user-input-area user-input-area-register" id="register-full-name">
            <input class="text-input auth-item auth-item-medium" id="register-given-name-input" type="text" name="given-name" placeholder="Given name(s)" maxlength="50" autocomplete="given-name">
            <input class="text-input auth-item auth-item-medium" id="register-family-name-input" type="text" name="family-name" placeholder="Family name" maxlength="20" autocomplete="family-name">
            <input class="auth-item auth-btn button-register auth-item-medium" id="register-full-name-btn" type="submit" value="Submit" disabled>
        </div>

        <button class="auth-item auth-btn auth-back-btn auth-item-medium" id="register-back-btn" type="button" title="Back">
            <i class="fas fa-arrow-left"></i>
        </button>
    </form>

    <div class="account-message">
        Already have an account? <span class="to-auth-page-btn" id="to-login-btn">Log in.</span>
    </div>
</div>

<script src="assets/js/auth.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        initRegister();
    });
</script>