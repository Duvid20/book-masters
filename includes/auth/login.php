<?php

$_SESSION['to_login'] = false;

if (isset($_SESSION['username']) && $_SESSION['username'] != "") {
    $usernameOrEmail = $_SESSION['username'];
} else if (isset($_SESSION['email']) && $_SESSION['email'] != "") {
    $usernameOrEmail = $_SESSION['email'];
}

if (isset($_POST['username']) && isset($_POST['password'])) {
    $usernameOrPassword = sanitizeValue($_POST['usernameOrEmail']);
    $password = sanitizeValue($_POST['password']);
    $password = password_verify($password, PASSWORD_DEFAULT);

    echo "usernameOrEmail: ", $usernameOrEmail;
    echo "password: ", $password;

    $sql = "SELECT id FROM _users WHERE username = ? AND password = ?";
    $result = executeSQL($sql, [$usernameOrEmail, $password]);
    $matchWithUsername = isset($result[0]['id']);

    echo "matchWithUsername: ", $matchWithUsername;

    $sql =
        "SELECT _users.id
        FROM _users 
        INNER JOIN _emails ON _users.id = _emails.f_id_user
        WHERE _users.password = ? AND _emails.email = ? AND _emails.is_verified = 1";
    $result = executeSQL($sql, [$password, $usernameOrEmail]);
    $matchWithEmail = isset($result[0]['id']);

    echo "matchWithEmail: ", $matchWithEmail;

    // $sql = "SELECT email FROM _emails WHERE email = ? AND ";

    // if ($user) {
    //     if (password_verify($password, $user['password'])) {
    //         $_SESSION['logged_in'] = true;
    //         $_SESSION['user_id'] = $user['id'];
    //         $_SESSION['username'] = $user['username'];
    //         $_SESSION['email'] = $user['email'];
    //         $_SESSION['given_name'] = $user['given_name'];
    //         $_SESSION['family_name'] = $user['given_name'];

    //         redirect("index.php");
    //     } else {
    //         echo "<script>alert('Invalid password.')</script>";
    //     }
    // } else {
    //     echo "<script>alert('Invalid username.')</script>";
    // }
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