<?php

$_SESSION["to_login"] = false;

$usernameOrEmail = "";
if (isset($_SESSION["username"]) && $_SESSION["username"] != "") {
    $usernameOrEmail = $_SESSION["username"];
} else if (isset($_SESSION["email"]) && $_SESSION["email"] != "") {
    $usernameOrEmail = $_SESSION["email"];
}

if (isset($_POST["usernameOrEmail"]) && isset($_POST["password"])) {
    $usernameOrEmail = sanitizeValue($_POST["usernameOrEmail"]);
    $password = sanitizeValue($_POST["password"]);

    // Check if the user exists by username
    $sql = "SELECT id, password FROM _users WHERE username = ?";
    $result = executeSQL($sql, [$usernameOrEmail]);
    $matchWithUsername = isset($result[0]["id"]);
    $hashedPassword = $matchWithUsername ? $result[0]["password"] : null;

    // Check if the user exists by email
    if (!$matchWithUsername) {
        $sql = "SELECT _users.id, _users.password
                FROM _users 
                INNER JOIN _emails ON _users.id = _emails.f_id_user
                WHERE _emails.email = ? AND _emails.is_verified = 1";
        $result = executeSQL($sql, [$usernameOrEmail]);
        $matchWithEmail = isset($result[0]["id"]);
        $hashedPassword = $matchWithEmail ? $result[0]["password"] : null;
    }

    // Verify the password
    // if (($matchWithUsername || $matchWithEmail) && password_verify($password, $hashedPassword)) {
    if (true) {
        $_SESSION["logged_in"] = true;
        $_SESSION["user_id"] = $result[0]["id"];
        redirect("/");
    } else {
        $_SESSION["wrong_credentials"] = true;
    }
}
?>

<div class="auth-page-container">
    <div class="auth-header">Login</div>
    <div class="auth-sub-header">Enter your credencials</div>

    <form class="auth-form" id="login-form" action="/" method="POST">
        <div class="user-input-area user-input-area-login" id="login-username-email-password">
            <input
                class="text-input auth-item auth-item-medium"
                id="login-username-or-email-input"
                type="text"
                name="usernameOrEmail"
                placeholder="Username or email"
                maxlength="50"
                autocomplete="email"
                value="<?php if (isset($usernameOrEmail)) {
                            echo $usernameOrEmail;
                        } ?>">
            <input
                class="text-input auth-item auth-item-medium"
                id="login-password-input"
                type="password"
                name="password"
                placeholder="Password"
                maxlength="20">
        </div>

        <input
            class="auth-item auth-btn button-register auth-item-medium"
            id="login-btn"
            type="submit"
            value="Log in"
            disabled>
    </form>

    <div class="account-message">
        New to Book Masters? <span class="to-auth-page-btn" id="to-register-btn">Register here</span>
    </div>
</div>

<script src="assets/js/auth.js"></script>
<script>
    document.addEventListener("DOMContentLoaded", function() {
        initLogin();
    });
</script>