<?php

// Se inicializa la sesion
if (session_status() == PHP_SESSION_NONE)
{
    session_start();
}

if (!isset($_GET['objectid'], $_SESSION['user']))
{
    echo 'falto un param';
    return;
}

include("./database/mysql.php");
$db = new ConnectDB();

$objectid = $_GET['objectid'];
$user = $_SESSION['user'];

$json = [];

$result = $db->executeQuery("SELECT * FROM items WHERE owner_id='$objectid'");
while ($row = $result->fetch())
{
    array_push($json, $row);
}

echo json_encode($json);
