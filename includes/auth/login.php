<?php

$_SESSION['to_login'] = false;

if (isset($_SESSION['username'])) {
    $usernameOrEmail = $_SESSION['username'];
} else if (isset($_SESSION['email'])) {
    $usernameOrEmail = $_SESSION['email'];
}

?>

<div class="auth-page-container">
    <div class="auth-header">Login</div>
    <div class="auth-sub-header">Enter your credencials</div>

    <form class="auth-form" id="login-form" action="/" method="POST">
        <div class="user-input-area">
            <input
                class="text-input auth-item auth-item-medium"
                id="login-username-or-email-input"
                type="text"
                name="username"
                placeholder="Username"
                maxlength="16"
                autocomplete="username"
                value="<?php if ($usernameOrEmail) {
                            echo $usernameOrEmail;
                        } ?>">
            <input class="text-input auth-item auth-item-medium" id="login-password-input" type="password" name="password" placeholder="Password" maxlength="20">
        </div>

        <input
            class="auth-item auth-btn button-register auth-item-medium"
            id="register-full-name-btn"
            type="submit"
            value="Submit"
            disabled>
    </form>

    <div class="account-message">
        New to Book Masters? <span class="to-auth-page-btn" id="to-register-btn">Register.</span>
    </div>
</div>

<script src="assets/js/auth.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        // initLogin();
    });
</script>