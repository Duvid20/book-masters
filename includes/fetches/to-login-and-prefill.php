<?php

require_once '../functions.php';
require_once '../db.php';


$_SESSION["to_login"] = true;

$username = "";
$email = "";

if (isset($_POST["username"])) {
    $username = sanitizeValue($_POST["username"]);
    $_SESSION["username"] = $username;
}

if (isset($_POST["email"])) {
    $email = sanitizeValue($_POST["email"]);
    $_SESSION["email"] = $email;
}

echo "PUBG";

redirect("../../../index.php");
