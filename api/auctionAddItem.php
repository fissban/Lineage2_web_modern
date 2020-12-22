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
    echo 'falto iniciar session';
    return;
}

if (!isset($_POST['owner_id'],
$_POST['item_id'],
$_POST['item_object_id'],
$_POST['item_count'],
$_POST['item_enchant_level'],
$_POST['item_type'],
$_POST['item_grade'],
$_POST['item_slot'],
$_POST['price_count'],
$_POST['price_id']))
{
    echo 'faltan parametros';
    return;
}

$owner_id           = $_POST['owner_id'];
$item_id            = $_POST['item_id'];
$item_object_id     = $_POST['item_object_id'];
$item_count         = $_POST['item_count'];
$item_enchant_level = $_POST['item_enchant_level'];

$item_type          = $_POST['item_type'];
$item_grade         = $_POST['item_grade'];
$item_slot          = $_POST['item_slot'];

$price_count        = $_POST['price_count'];
$price_id           = $_POST['price_id'];

$data =
    [
        'type'   => 'SUCCESS',
        'message' => ''
    ];

if ($price_count <= 0)
{
    $data['type'] = 'WARNING';
    $data['message'] = 'You cannot sell at a price of 0 or negative';
    echo json_encode($data);
    return;
}

if ($item_count <= 0)
{
    $data['type'] = 'WARNING';
    $data['message'] = 'You have to sell more than one item';
    echo json_encode($data);
    return;
}

$result = $db->executeQueryParams("SELECT * FROM characters WHERE obj_Id=?", [$owner_id]);
while ($row = $result->fetch())
{
    if ($row['online'] == 1)
    {
        $data['type'] = 'WARNING';
        $data['message'] = 'Your character must be offline in order to sell an item.';
        echo json_encode($data);
        return;
    }
}
// se busca en la DB el item que se intenta vender.
$result = $db->executeQueryParams("SELECT * FROM items WHERE owner_id=? AND object_id=? AND enchant_level=? LIMIT 1", [$owner_id, $item_object_id, $item_enchant_level]);

// usamos while porq no se que otra cosa usar pero solo traera 1 item porq asi es el query y mas no se pueden leer desde la DB.
while ($row = $result->fetch())
{
    if ($row['count'] < $item_count)
    {
        $data['type'] = 'WARNING';
        $data['message'] = 'You are trying to sell more items than you have';
        echo json_encode($data);
        return;
    }

    $resultDelete;
    // DELETE ITEM
    if ($row['count'] == $item_count)
    {
        $resultDelete = $db->executeQueryParams("DELETE FROM items WHERE object_id=?", [$item_object_id]);
    }
    // UPDATE ITEM
    else
    {
        $newCount = $row['count'] - $item_count;
        $resultDelete = $db->executeQueryParams("UPDATE items SET count=? WHERE object_id=?", [$newCount, $item_object_id]);
    }

    if ($resultDelete)
    {
        $params =
            [
                $owner_id,
                $item_id,
                $item_object_id,
                $item_count,
                $item_enchant_level,
                $item_type,
                $item_grade,
                $item_slot,
                $price_count,
                $price_id,
            ];
        $resultIsert = $db->executeQueryParams("INSERT INTO auction_items(owner_id, item_id, item_object_id, item_count, item_enchant_level, item_type, item_grade, item_slot, price_count, price_id) VALUES (?,?,?,?,?,?,?,?,?,?)", $params);

        $data['message'] = 'Your item was successfully put up for sale';
        echo json_encode($data);
        return;
    }
    else
    {
        $data['type'] = 'WARNING';
        $data['message'] = 'Could not delete item from db';
        echo json_encode($data);
        return;
    }
}

// si llegamos a este punto es porq no se encontro el item que se quiere vender en la DB
$data['type'] = 'WARNING';
$data['message'] = 'You are trying to sell an item that is not yours';
echo json_encode($data);
