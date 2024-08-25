<div id="content">
    <?php

    if (checkIfSessionVariableTrue("logged_in")) {
        echo "<script>alert('Logged in.')</script>";
        require_once 'includes/pages/home.php';
    } else if (checkIfSessionVariableTrue("to_login")) {
        echo "<script>alert('To login.')</script>";
        require_once 'includes/auth/login.php';
    } else if (checkIfSessionVariableTrue("login_failed")) {
        echo "<script>alert('Login failed. Wrong credencials.')</script>";
        require_once 'includes/auth/login.php';
    } else if (checkIfSessionVariableTrue("register_failed")) {
        echo "<script>alert('Register failed.')</script>";
        require_once 'includes/auth/register.php';
    } else if (checkIfSessionVariableTrue("to_register")) {
        echo "<script>alert('To register.')</script>";
        require_once 'includes/auth/register.php';
    } else {
        echo "<script>alert('Default redirect to register.')</script>";
        require_once 'includes/auth/register.php';
    }

    if (isset($_SESSION['logged_in'])) {
        if ($_SESSION['logged_in'] == true) {
            echo "Session logged_in set to: true";
        } else {
            echo "Session logged_in set to: false";
        }
    } else {
        echo "Session logged_in not set";
    }

    // Debugging output
    echo '<pre>';
    print_r($_SESSION);
    echo '</pre>';

    ?>
</div>