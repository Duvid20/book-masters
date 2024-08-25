<?php

require_once 'functions.php';

function getConnection()
{
    $servername = "localhost";
    $username = "root";
    $password = "";
    $dbname = "book_masters";

    $conn = new mysqli($servername, $username, $password, $dbname);

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    return $conn;
}

function executeSQL($sql, $params)
{
    $conn = getConnection();
    $params = sanitize($params);

    try {
        $stmt = $conn->prepare($sql);
        $types = getParameterTypes($params);
        $stmt->bind_param($types, ...$params);
        $stmt->execute();

        // SELECT-queries: return result set
        if (stripos($sql, 'SELECT') === 0) {
            $result = $stmt->get_result();
            $data = $result->fetch_all(MYSQLI_ASSOC);
            return $data;
        } else {
            // non-SELECT queries: return number of affected rows
            return $stmt->affected_rows;
        }
    } catch (Exception $e) {
        echo ("Error executing SQL: " . $e->getMessage());
        return false;
    } finally {
        // close statement and connection
        if (isset($stmt)) {
            $stmt->close();
        }
        $conn->close();
    }
}

function getParameterTypes($params)
{
    $types = '';
    foreach ($params as $param) {
        if (is_int($param)) {
            $types .= 'i';
        } elseif (is_double($param)) {
            $types .= 'd';
        } elseif (is_string($param)) {
            $types .= 's';
        } else {
            $types .= 'b';
        }
    }

    return $types;
}

function sanitize($params)
{
    foreach ($params as $key => $param) {
        $params[$key] = sanitizeValue($param);
    }

    return $params;
}

function checkIfExistsInTable($table, $column, $value)
{
    $sql = "SELECT id FROM $table WHERE $column = ?";
    $result = executeSQL($sql, [$value]);
    return count($result) > 0;
}


function isUsernameInUse($username)
{
    return checkIfExistsInTable('_users', 'username', $username);
}

function isEmailInUse($email)
{
    return checkIfExistsInTable('_emails', 'email', $email);
}

function getPoints($id)
{
    $sql = "SELECT points FROM _users WHERE id = ?";
    $result = executeSQL($sql, [$id]);
    return $result[0]['points'];
}
