<?php

include("./database/mysql.php");
$db = new ConnectDB();

// Se verifica si el nombre de usuario o email ya esta en uso
$result = $db->executeQuery("SELECT * FROM grandboss_data");

$json = [];

while ($row = $result->fetch())
{
    array_push($json, $row);
}

echo json_encode($json);
