<?php

require_once '../functions.php';
require_once '../db.php';

$id = $_SESSION["id"];
$username = $_SESSION["username"];
$joinedDate = (new DateTime($_SESSION["created_at"]))->format('F Y');
$points = getPoints($id);
$followersCount = getFollowersCount($id);
$followingCount = getFollowingCount($id);

$followers = getFollowers($id);

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
        <div>
            <?php echo $followersCount ?> followers
        </div>
        <div>Following <?php echo $followingCount ?></div>
    </div>

    <div>Followers</div>
    <pre>
        <?php
        foreach ($followers as $follower) {
            echo $follower["username"] . "\n";
        }
        ?>
    </pre>

</div>