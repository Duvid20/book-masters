<?php
require_once '../functions.php';

session_start();
session_unset();
session_destroy();

session_start();
$_SESSION['to_login'] = true;

redirect("../../index.php");
exit();
