<?php

include("./database/mysql.php");
$db = new ConnectDB();

// Se verifica si el nombre de usuario o email ya esta en uso
$result = $db->executeQuery("SELECT * FROM raidboss_spawnlist");

$json = [];

while ($row = $result->fetch())
{
    array_push($json, $row);
}

echo json_encode($json);
