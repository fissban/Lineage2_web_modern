<?php

include("./database/mysql.php");
$db = new ConnectDB();

$data =
    [
        ["castle" => "Gludio",    "owner" => "N/A", "taxPercent" => "0 %", "siegeDate" => "00/00/0000"],
        ["castle" => "Dion",      "owner" => "N/A", "taxPercent" => "0 %", "siegeDate" => "00/00/0000"],
        ["castle" => "Giran",     "owner" => "N/A", "taxPercent" => "0 %", "siegeDate" => "00/00/0000"],
        ["castle" => "Oren",      "owner" => "N/A", "taxPercent" => "0 %", "siegeDate" => "00/00/0000"],
        ["castle" => "Aden",      "owner" => "N/A", "taxPercent" => "0 %", "siegeDate" => "00/00/0000"],
        ["castle" => "Innadril",  "owner" => "N/A", "taxPercent" => "0 %", "siegeDate" => "00/00/0000"],
        ["castle" => "Goddard",   "owner" => "N/A", "taxPercent" => "0 %", "siegeDate" => "00/00/0000"],
        ["castle" => "Rune",      "owner" => "N/A", "taxPercent" => "0 %", "siegeDate" => "00/00/0000"],
        ["castle" => "Shuttgart", "owner" => "N/A", "taxPercent" => "0 %", "siegeDate" => "00/00/0000"],
    ];
// Se verifica si el nombre de usuario o email ya esta en uso
$result = $db->executeQuery("SELECT * FROM clan_data WHERE hasCastle>'0'");

$hasCastle = [];

while ($row = $result->fetch())
{
    $data[$row['hasCastle']]['owner'] = $row['clan_name'];

    $data[$row['hasCastle']]['taxPercent'] = $row['taxPercent'] . " %";
    $data[$row['hasCastle']]['siegeDate'] = $row['siegeDate'];
}

echo json_encode($data);
