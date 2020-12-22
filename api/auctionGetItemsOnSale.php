<?php

include("./database/mysql.php");
$db = new ConnectDB();

// Se inicializa la sesion
if (session_status() == PHP_SESSION_NONE)
{
    session_start();
}

if (!isset($_SESSION['user']))
{
    echo '';
    return;
}

// lista de obj_id de los personajes de una cuenta
$owners = [];

// Se obtienen los obj_Id de una cuenta.
$user = $_SESSION['user'];
$result = $db->executeQuery("SELECT * FROM characters WHERE account_name='$user'");
while ($row = $result->fetch())
{
    array_push($owners, $row['obj_Id']);
}

$itemsPerPage = 200; // TODO por ahora un valor alto porq no usaremos pag pero lo dejamos a futuro

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

// Se genera la condicion custom de acuerdo a los obj_Id leidos
$condition = "";
foreach ($owners as $ow)
{
    if ($condition == "")
    {
        $condition .= "owner_id='$ow'";
    }
    else
    {
        $condition .= " OR owner_id='$ow'";
    }
}

// Se obtiene el total de auctions de un player
$result = $db->executeQuery("SELECT count(id) AS size FROM auction_items WHERE ($condition)");
while ($row = $result->fetch())
{
    $json['pageSize'] = $row['size'];
}

// Se leen los items y se envian
$result = $db->executeQuery("SELECT * FROM auction_items WHERE $condition LIMIT $pageMin , $pageMax");
while ($row = $result->fetch())
{
    array_push($json['data'], $row);
}

echo json_encode($json);
