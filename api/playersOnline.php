<?php

include("./database/mysql.php");
$db = new ConnectDB();

$result = $db->executeQuery("SELECT COUNT('obj_Id') AS count FROM characters WHERE online=1");

$json = [];

while ($row = $result->fetch())
{
    array_push($json, $row);
}

echo json_encode($json);
