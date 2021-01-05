<?php

include("./database/mysql.php");
$db = new ConnectDB();

// Se verifica si el nombre de usuario o email ya esta en uso
$result = $db->executeQuery("SELECT * FROM characters WHERE accesslevel='0' ORDER BY pkkills DESC LIMIT 25");

$json = [];

while ($row = $result->fetch())
{
    array_push($json, $row);
}

$result = $db->executeQuery("SELECT * FROM clan_data");

while ($row = $result->fetch())
{
    foreach ($json as &$d)
    {
        $d['clan_name'] = 'N/A';
        if ($d['clanid'] == $row['clan_id'])
        {
            $d['clan_name'] = $row['clan_name'];
        }
    }
}

echo json_encode($json);
