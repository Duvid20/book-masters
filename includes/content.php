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
    
    ?>
</div>