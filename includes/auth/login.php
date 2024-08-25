<?php

$_SESSION["to_login"] = false;
$_SESSION["register_failed"] = false;

$usernameOrEmail = "";
if (isset($_SESSION["username"]) && $_SESSION["username"] != "") {
    $usernameOrEmail = $_SESSION["username"];
} else if (isset($_SESSION["email"]) && $_SESSION["email"] != "") {
    $usernameOrEmail = $_SESSION["email"];
}

if (isset($_POST["usernameOrEmail"]) && isset($_POST["password"])) {
    $usernameOrEmail = sanitizeValue($_POST["usernameOrEmail"]);
    $plainPassword = sanitizeValue($_POST["password"]);

    $matchWithEmail = false;

    // check if user exists by username
    $sql = "SELECT id, password FROM _users WHERE username = ?";
    $result = executeSQL($sql, [$usernameOrEmail])[0];
    $matchWithUsername = isset($result["id"]);
    $hashedPassword = $matchWithUsername ? $result["password"] : null;

    // check if user exists by email
    if (!$matchWithUsername) {
        $sql = "SELECT _users.id, _users.password
                FROM _users 
                INNER JOIN _emails ON _users.id = _emails.f_id_user
                WHERE _emails.email = ? AND _emails.is_verified = 1";
        $result = executeSQL($sql, [$usernameOrEmail])[0];
        $matchWithEmail = isset($result["id"]);
        $hashedPassword = $matchWithEmail ? $result["password"] : null;
    }

    $passwordsMatch = password_verify($plainPassword, $hashedPassword);

    // if user exists and passwords match, log in user
    if (($matchWithUsername || $matchWithEmail) && $passwordsMatch) {
        $id = $result["id"];
        $_SESSION["logged_in"] = true;
        $_SESSION["login_failed"] = false;

        // save user data into session
        $sql = "SELECT given_name, family_name, username, is_admin, is_bookinator, points, created_at FROM _users WHERE id = ?";
        $result = executeSQL($sql, [$id])[0];

        $_SESSION["id"] = $id;
        $_SESSION["given_name"] = $result["given_name"];
        $_SESSION["family_name"] = $result["family_name"];
        $_SESSION["username"] = $result["username"];
        $_SESSION["is_admin"] = $result["is_admin"];
        $_SESSION["is_bookinator"] = $result["is_bookinator"];
        $_SESSION["created_at"] = $result["created_at"];
    } else {
        $_SESSION["login_failed"] = true;
        $_SESSION["logged_in"] = false;
    }

    reloadPage();
}

?>
<div class="auth-page-container">
    <div class="auth-header">Login</div>
    <div class="auth-sub-header">Enter your credentials</div>
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