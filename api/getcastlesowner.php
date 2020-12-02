<?php

include("./database/mysql.php");
$db = new ConnectDB();

$data =
    [
        ["castle" => "Gludio",    "owner" => "none"],
        ["castle" => "Dion",      "owner" => "none"],
        ["castle" => "Giran",     "owner" => "none"],
        ["castle" => "Oren",      "owner" => "none"],
        ["castle" => "Aden",      "owner" => "none"],
        ["castle" => "Innadril",  "owner" => "none"],
        ["castle" => "Goddard",   "owner" => "none"],
        ["castle" => "Rune",      "owner" => "none"],
        ["castle" => "Shuttgart", "owner" => "none"],
    ];
// Se verifica si el nombre de usuario o email ya esta en uso
$result = $db->executeQuery("SELECT * FROM clan_data WHERE hasCastle>'0'");

$hasCastle = [];

while ($row = $result->fetch())
{
    $data[$row['hasCastle']]['owner'] = $row['clan_name'];
}

echo json_encode($data);
