<?php

// Se inicializa la sesion
if (session_status() == PHP_SESSION_NONE)
{
    session_start();
}

if (!isset($_SESSION["isLogin"]))
{
    echo "no login";
    return;
}

$user = $_SESSION["user"];

$data = [];

include("./database/mysql.php");
$db = new ConnectDB();

$result = $db->executeQuery("SELECT * FROM characters WHERE account_name='$user'");
while ($row = $result->fetch())
{
    array_push($data, $row);
}

$result = $db->executeQuery("SELECT * FROM clan_data");

while ($row = $result->fetch())
{
    foreach ($data as &$d)
    {
        $d['clan_name'] = 'N/A';
        if ($d['clanid'] == $row['clan_id'])
        {
            $d['clan_name'] = $row['clan_name'];
        }
    }
}

echo json_encode($data);
