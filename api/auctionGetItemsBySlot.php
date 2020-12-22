<?php

include("./database/mysql.php");
$db = new ConnectDB();

if (!isset($_GET['slot']))
{
    echo 'faltan parametros';
    return;
}

$itemSlot = $_GET['slot'];
$itemsPerPage = 25;

$pageMin = 0;
$pageMax = $itemsPerPage;

if (isset($_GET['page']))
{
    $pageMin =  ($_GET['page'] - 1) * $itemsPerPage;
    $pageMax =  $_GET['page'] * $itemsPerPage;
}

$json =
    [
        'pageSize' => '1',
        'data' => []
    ];

// se obtiene el total de noticias existentes
$result = $db->executeQuery("SELECT count(id) AS size FROM auction_items");
while ($row = $result->fetch())
{
    $json['pageSize'] = $row['size'];
}

// Se verifica si el nombre de usuario o email ya esta en uso
$result;

if ($itemSlot == 'ALL')
{
    $result = $db->executeQuery("SELECT * FROM auction_items LIMIT $pageMin , $pageMax");
}
else
{
    $result = $db->executeQuery("SELECT * FROM auction_items WHERE item_slot='$itemSlot' LIMIT $pageMin , $pageMax");
}

while ($row = $result->fetch())
{
    array_push($json['data'], $row);
}

echo json_encode($json);
