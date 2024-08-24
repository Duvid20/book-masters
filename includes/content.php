<div id="content">
    <?php

    if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {
        require_once 'includes/pages/home.php';
    } else if (isset($_SESSION['to_login']) && $_SESSION['to_login'] == true) {
        require_once 'includes/auth/login.php';
    } else if (isset($_SESSION["logged_in"]) && $_SESSION["logged_in"] == true) {
        require_once 'includes/pages/home.php';
    } else if (isset($_SESSION["wrong_credentials"]) && $_SESSION["wrong_credentials"] == true) {
        echo "<script>alert('Wrong credencials.')</script>";
        require_once 'includes/auth/login.php';
    } else {
        require_once 'includes/auth/register.php';
    }

    ?>
</div>