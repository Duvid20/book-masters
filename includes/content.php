<div id="content">
    <?php

    if (isset($_SESSION['logged_in']) && $_SESSION['logged_in'] == true) {
        require_once 'includes/pages/home.php';
    } else {
        require_once 'includes/auth/register.php';
    }

    ?>
</div>