<?php

function getConnection()
{
    $servername = "web008.wifiooe.at";
    $username = "web008";
    $password = "";
    $dbname = "web008";

    $conn = new mysqli($servername, $username, $password, $dbname);
    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }
    return $conn;
}