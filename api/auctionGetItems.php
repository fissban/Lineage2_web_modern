<?php

include("./database/mysql.php");
$db = new ConnectDB();

if (!isset($_GET['action']))
{
    echo 'faltan parametros';
    return;
}

$action = $_GET['action'];
$value = $_GET['value'];
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

$where = "";

$result;
// Se leen los items de acuerdo a lo solicitado
switch ($action)
{
    case 'ALL':
        $where = "";
        break;
    case 'SLOT':
        $where = "WHERE item_slot='$value'";
        break;
    case 'TYPE':
        $where = "WHERE item_type='$value'";
        break;
}

// se obtiene el total de auctions
$result = $db->executeQuery("SELECT count(id) AS size FROM auction_items $where");
while ($row = $result->fetch())
{
    $json['pageSize'] = $row['size'];
}

$result = $db->executeQuery("SELECT * FROM auction_items $where LIMIT $pageMin , $pageMax");
while ($row = $result->fetch())
{
    array_push($json['data'], $row);
}

echo json_encode($json);
