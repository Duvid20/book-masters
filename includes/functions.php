<?php

function sanitizeInput($data)
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
