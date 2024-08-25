<?php

require_once '../functions.php';
require_once '../db.php';

$id = $_SESSION["id"];
$username = $_SESSION["username"];
$joinedDate = (new DateTime($_SESSION["created_at"]))->format('F Y');
$points = getPoints($id);

?>

<div class="page" id="profile-page">
    <div>
        <div>
            <?php echo $username ?>
        </div>
        <div>
            <div>Joined <?php echo $joinedDate ?></div>
        </div>
        <div>
            <div><?php echo $points ?> points</div>
        </div>
    </div>

</div>