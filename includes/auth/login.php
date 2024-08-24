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

    $matchWithEmail = false;

    // check if user exists by username
    $sql = "SELECT id, password FROM _users WHERE username = ?";
    $result = executeSQL($sql, [$usernameOrEmail]);
    $matchWithUsername = isset($result[0]["id"]);
    $hashedPassword = $matchWithUsername ? $result[0]["password"] : null;

    // check if user exists by email
    if (!$matchWithUsername) {
        $sql = "SELECT _users.id, _users.password
                FROM _users 
                INNER JOIN _emails ON _users.id = _emails.f_id_user
                WHERE _emails.email = ? AND _emails.is_verified = 1";
        $result = executeSQL($sql, [$usernameOrEmail]);
        $matchWithEmail = isset($result[0]["id"]);
        $hashedPassword = $matchWithEmail ? $result[0]["password"] : null;
    }

    // verify password
    if (($matchWithUsername || $matchWithEmail) && password_verify($password, $hashedPassword)) {
        $_SESSION["logged_in"] = true;
        $_SESSION["user_id"] = $result[0]["id"];
    } else if ($matchWithUsername || $matchWithEmail) {
        echo "Invalid username or email: ", $usernameOrEmail, "<br>";
        // $_SESSION["wrong_credentials"] = true;
    } else if (password_verify($password, $hashedPassword)) {
        echo "Invalid password.", $password;
        // $_SESSION["wrong_credentials"] = true;
    } else {
        echo "Other login error";
        // $_SESSION["wrong_credentials"] = true;
    }

    // $_SESSION["matchWithUsername"] = $matchWithUsername;
    // $_SESSION["matchWithEmail"] = $matchWithEmail;
    // $_SESSION["hashedPassword"] = $hashedPassword;
    // $_SESSION["password"] = $password;
    // $_SESSION["usernameOrEmail"] = $usernameOrEmail;
    // $_SESSION["result"] = $result;

    var_dump($_SESSION);
    // reloadPage();
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