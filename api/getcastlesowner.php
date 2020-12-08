<?php

include("./database/mysql.php");
$db = new ConnectDB();

$data =
    [
        ["castle" => "Gludio",    "owner" => "N/A"],
        ["castle" => "Dion",      "owner" => "N/A"],
        ["castle" => "Giran",     "owner" => "N/A"],
        ["castle" => "Oren",      "owner" => "N/A"],
        ["castle" => "Aden",      "owner" => "N/A"],
        ["castle" => "Innadril",  "owner" => "N/A"],
        ["castle" => "Goddard",   "owner" => "N/A"],
        ["castle" => "Rune",      "owner" => "N/A"],
        ["castle" => "Shuttgart", "owner" => "N/A"],
    ];
// Se verifica si el nombre de usuario o email ya esta en uso
$result = $db->executeQuery("SELECT * FROM clan_data WHERE hasCastle>'0'");

$hasCastle = [];

while ($row = $result->fetch())
{
    $data[$row['hasCastle']]['owner'] = $row['clan_name'];
}

echo json_encode($data);
