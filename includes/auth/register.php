<?php

$_SESSION['to_register'] = false;
$username;
$email;

if (isset($_SESSION['username']) && $_SESSION['username'] != "") {
    $username = $_SESSION['username'];
}

if (isset($_SESSION['email']) && $_SESSION['email'] != "") {
    $email = $_SESSION['email'];
}

if (
    isset($_POST['username']) &&
    isset($_POST['email']) &&
    isset($_POST['password']) &&
    isset($_POST['given-name']) &&
    isset($_POST['family-name'])
) {
    $username = $_POST['username'];
    $email = $_POST['email'];
    $password = $_POST['password'];
    $givenName = $_POST['given-name'];
    $familyName = $_POST['family-name'];

    $isUsernameInUse = isUsernameInUse($username);
    $isEmailInUse = isEmailInUse($email);

    if (!$isUsernameInUse && !$isEmailInUse) {
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

        $sql = "INSERT INTO _users (given_name, family_name, username, password) VALUES (?, ?, ?, ?)";
        $result = executeSQL($sql, [$givenName, $familyName, $username, $hashedPassword]);

        $sql = "SELECT id FROM _users WHERE username = ?";
        $result = executeSQL($sql, [$username]);
        $id = $result[0]['id'];

        $sql = "INSERT INTO _emails (email, f_id_user) VALUES (?, ?)";
        $success = executeSQL($sql, [$email, $id]);

        if ($success) {
            $_SESSION['username'] = $username;
            $_SESSION['email'] = $email;
            $_SESSION['to_login'] = true;
            $_SESSION['register_failed'] = false;
        } else {
            $_SESSION['register_failed'] = true;
        }

        reloadPage();
        exit();
    }
}

?>
<div class="auth-page-container">
    <div class="auth-header">Register</div>
    <div class="auth-sub-header" id="register-sub-header">Choose your username</div>

    <form class="auth-form" id="register-form" action="/" method="POST">
        <div class="user-input-area user-input-area-register active" id="register-username">
            <input
                class="text-input auth-item auth-item-medium"
                id="register-username-input"
                type="text"
                name="username"
                placeholder="Username"
                maxlength="16"
                autocomplete="username"
                value="<?php if (isset($username)) {
                            echo $username;
                        } ?>">
            <button
                class="auth-item auth-btn button-register auth-item-medium"
                id="register-username-btn"
                type="button"
                disabled>
                Continue
            </button>
        </div>

        <div class="user-input-area user-input-area-register" id="register-email">
            <input
                class="text-input auth-item auth-item-large"
                id="register-email-input"
                type="email"
                name="email"
                placeholder="Email"
                maxlength="50"
                autocomplete="email"
                value="<?php if (isset($email)) {
                            echo $email;
                        } ?>">
            <button
                class="auth-item auth-btn button-register auth-item-medium"
                id="register-email-btn"
                type="button"
                disabled>
                Continue
            </button>
        </div>

        <div class="user-input-area user-input-area-register" id="verify-email">
            <input
                class="text-input auth-item auth-item-medium"
                id="verif-code-input"
                type="text"
                name="verif-code"
                placeholder="Code from Email">
            <button
                class="auth-item auth-btn button-register auth-item-medium"
                id="verify-email-btn"
                type="button">
                Continue/Skip
            </button>
        </div>

        <div class="user-input-area user-input-area-register" id="register-password">
            <input
                class="text-input auth-item auth-item-medium"
                id="register-password-input"
                type="password"
                name="password"
                placeholder="Password"
                maxlength="20">
            <input
                class="text-input auth-item auth-item-medium"
                id="register-password-confirm-input"
                type="password"
                name="password-confirm"
                placeholder="Confirm password"
                maxlength="20">
            <button class="auth-item auth-btn button-register auth-item-medium"
                id="register-password-btn"
                type="button"
                disabled>
                Continue
            </button>
        </div>

        <div class="user-input-area user-input-area-register" id="register-full-name">
            <input
                class="text-input auth-item auth-item-medium"
                id="register-given-name-input"
                type="text"
                name="given-name"
                placeholder="Given name(s)"
                maxlength="50"
                autocomplete="given-name">
            <input class="text-input auth-item auth-item-medium"
                id="register-family-name-input"
                type="text"
                name="family-name"
                placeholder="Family name"
                maxlength="20"
                autocomplete="family-name">
            <input
                class="auth-item auth-btn button-register auth-item-medium"
                id="register-full-name-btn"
                type="submit"
                value="Create account"
                disabled>
        </div>

        <button
            class="auth-item auth-btn auth-back-btn auth-item-medium"
            id="register-back-btn"
            type="button"
            title="Back">
            <i class="fas fa-arrow-left"></i>
        </button>
    </form>

    <div class="account-message">
        Already have an account? <span class="to-auth-page-btn" id="to-login-btn">Log in here</span>
    </div>
</div>

<script src="assets/js/auth.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        initRegister();
    });
</script>