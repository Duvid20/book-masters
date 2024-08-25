<?php
session_start();

if (isset($_GET['page'])) {
    $page = $_GET['page'];
    $allowedPages = ['home', 'search', 'create', 'profile', 'news', 'settings'];

    if (in_array($page, $allowedPages)) {
        require_once "../pages/{$page}.php";
    }
}
