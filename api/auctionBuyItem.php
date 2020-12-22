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

if (!isset($_POST['id'], $_POST['item_count'], $_POST['buyer_obj_id']))
{

    var_dump($_POST);
    echo 'faltan parametros';
    return;
}

$id         = $_POST['id'];
$item_count = $_POST['item_count'];
$buyer_id   = $_POST['buyer_obj_id'];

$data =
    [
        'type'   => 'SUCCESS',
        'message' => ''
    ];

if ($item_count <= 0)
{
    $data['type'] = 'WARNING';
    $data['message'] = 'You have to buy more than one item';
    echo json_encode($data);
    return;
}


// SE VERIFICA QUE EL COMPRADOR ESTE OFFLINE --------------------------------------------------------------------------------------------------------
$result = $db->executeQueryParams("SELECT * FROM characters WHERE obj_Id=?", [$buyer_id]);
if ($result->rowCount() == 0)
{
    $data['type'] = 'WARNING';
    $data['message'] = 'Sql Inject.';
    echo json_encode($data);
    return;
}
else
{
    while ($row = $result->fetch())
    {
        if ($row['online'] == 1)
        {
            $data['type'] = 'WARNING';
            $data['message'] = 'Your character must be offline in order to purchase an item.';
            echo json_encode($data);
            return;
        }
    }
}

// SE BUSCA EN LA DB EL ITEM QUE SE INTENTA COMPRAR ------------------------------------------------------------------------------------------------
$result = $db->executeQueryParams("SELECT * FROM auction_items WHERE id=?", [$id]);
while ($row = $result->fetch())
{
    if ($row['item_count'] > $item_count)
    {
        $data['type'] = 'WARNING';
        $data['message'] = 'You are trying to buy more items than are for sale!';
        echo json_encode($data);
        return;
    }

    // SE VERIFICA QUE EL COMPRADOR TENGA SUFICIENTE ADENA PARA COMPRAR EL ITEM ---------------------------------------------------------------------
    $resultAdena = $db->executeQueryParams("SELECT * FROM items WHERE item_id=? AND owner_id=?", [$row['price_id'], $buyer_id]);
    if ($resultAdena->rowCount() == 0)
    {
        $data['type'] = 'WARNING';
        $data['message'] = 'You do not have adena to make a purchase';
        echo json_encode($data);
        return;
    }
    while ($rowAdena = $resultAdena->fetch())
    {
        if ($rowAdena['count'] < $row['price_count'] * $item_count)
        {
            $data['type'] = 'WARNING';
            $data['message'] = 'You do not have enough funds to buy the item!';
            echo json_encode($data);
            return;
        }
    }
    // SE APLICA EL DESCUENTO DE LA COMPRA DEL ITEM ---------------------------------------------------------------------------------------------------
    if ($rowAdena['count'] == $row['price_count'] * $item_count)
    {
        $resultDelete = $db->executeQueryParams("DELETE FROM items WHERE item_id=? AND owner_id=?", [$row['price_id'], $buyer_id]);
    }
    else
    {
        $newCount = $row['item_count'] -  ($row['price_count'] * $item_count);
        $resultDelete = $db->executeQueryParams("UPDATE items SET count=? WHERE item_id=? AND owner_id=?", [$newCount, $row['item_id'], $buyer_id]);
    }


    // DELETE AUCTION_ITEMS --------------------------------------------------------------------------------------------------------------------------
    $resultDelete;
    if ($row['item_count'] == $item_count)
    {
        $resultDelete = $db->executeQueryParams("DELETE FROM auction_items WHERE id=?", [$id]);
    }
    // UPDATE AUCTION_ITEMS
    else
    {
        $newCount = $row['item_count'] - $item_count;
        $resultDelete = $db->executeQueryParams("UPDATE auction_items SET item_count=? WHERE id=?", [$newCount, $id]);
    }

    // SE INSERTA EL ITEM COMPRADO A LA TABLA ITEMS ----------------------------------------------------------------------------------------------
    if ($resultDelete)
    {
        $params =
            [
                $buyer_id,
                $row['item_object_id'],
                $row['item_id'],
                $item_count,
                $row['item_enchant_level'],
                'INVENTORY',
                0,
                1606711688883,
            ];
        $db->executeQueryParams("INSERT INTO items(owner_id, object_id, item_id, count, enchant_level, loc, loc_data, time) VALUES (?,?,?,?,?,?,?,?)", $params);

        $params =
            [
                $row['owner_id'],
                $row['item_id'],
                $item_count,
                $row['item_enchant_level'],
                $row['price_count'],
                $row['price_id']
            ];
        // SE INSERTA EN LA TABLA LA RECOMPENSA DE LA COMPRA AL VENDEDOR -------------------------------------------------------------------------------
        $db->executeQueryParams("INSERT INTO auction_items_sold(owner_id, item_id, item_count, item_enchant_level, price_count, price_id) VALUES (?,?,?,?,?,?)", $params);

        $data['message'] = 'Your purchase was successful';
        echo json_encode($data);
        return;
    }
    else
    {
        $data['type'] = 'WARNING';
        $data['message'] = 'There was a problem!';
        echo json_encode($data);
        return;
    }
}

// si llegamos a este punto es porq no se encontro el item que se quiere vender en la DB
$data['type'] = 'WARNING';
$data['message'] = 'The item you are trying to buy was not found';
echo json_encode($data);
