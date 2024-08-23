<?php
session_start();
require_once 'includes/functions.php';
require_once 'includes/db.php';
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
    <link rel="stylesheet" href="assets/css/reset.css">
    <link rel="stylesheet" href="assets/css/style.css">
    <link rel="stylesheet" href="assets/css/nav.css">
    <link rel="stylesheet" href="assets/css/auth.css">
    <title>Book Masters</title>
</head>

<div id="container">

    <?php
    require_once 'includes/content.php';
    require_once 'includes/nav.php';
    ?>

</div>

<script src="assets/js/utils.js"></script>
<script src="assets/js/main.js"></script>

</html>