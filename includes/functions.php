<?php

function sanitizeValue($data)
{
    return htmlspecialchars(trim($data));
}

function escapeInput($conn, $data)
{
    return mysqli_real_escape_string($conn, $data);
}

function redirect($url)
{
    header("Location: $url");
    exit();
}

function isCsrfTokenValid()
{
    return isset($_POST['csrf_token']) && $_POST['csrf_token'] === $_SESSION['csrf_token'];
}

function reloadPage()
{
    header("Location: " . $_SERVER['REQUEST_URI']);
    exit();
}

function checkIfSessionVariableTrue($variable)
{
    return isset($_SESSION[$variable]) && $_SESSION[$variable] == true;
}
