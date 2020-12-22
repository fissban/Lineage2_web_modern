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

if (!isset($_POST['id']))
{
    echo 'faltan parametros';
    return;
}

$id = $_POST['id'];

// Lista de obj_id de los personajes de una cuenta
// Se genera la condicion custom de acuerdo a los obj_Id leidos
$condition = "";
// Se obtienen los obj_Id de una cuenta.
$user = $_SESSION['user'];
$result = $db->executeQuery("SELECT * FROM characters WHERE account_name='$user'");
while ($row = $result->fetch())
{
    $obj_id = $row['obj_Id'];
    if ($condition == "")
    {
        $condition .= "owner_id='$obj_id'";
    }
    else
    {
        $condition .= " OR owner_id='$obj_id'";
    }
}

$data =
    [
        'type'   => 'SUCCESS',
        'message' => ''
    ];
// se busca en la DB el item que se intenta cancelar el auction.
$result = $db->executeQuery("SELECT * FROM auction_items WHERE id='$id' AND ($condition)");

// usamos while porq no se que otra cosa usar pero solo traera 1 item porq asi es el query y mas no se pueden leer desde la DB.
while ($row = $result->fetch())
{

    $resultOnline = $db->executeQueryParams("SELECT * FROM characters WHERE obj_Id=?", [$row['owner_id']]);
    while ($rowOnline = $resultOnline->fetch())
    {
        if ($rowOnline['online'] == 1)
        {
            $data['type'] = 'WARNING';
            $data['message'] = 'Your character must be offline in order to cancel auction an item.';
            echo json_encode($data);
            return;
        }
    }

    // DELETE ITEM
    $resultDelete = $db->executeQueryParams("DELETE FROM auction_items WHERE id=?", [$id]);

    if ($resultDelete)
    {
        $params =
            [
                $row['owner_id'],
                $row['item_object_id'],
                $row['item_id'],
                $row['item_count'],
                $row['item_enchant_level'],
                'INVENTORY',
                0,
                1606711688883,
            ];
        $db->executeQueryParams("INSERT INTO items(owner_id, object_id, item_id, count, enchant_level, loc, loc_data, time) VALUES (?,?,?,?,?,?,?,?)", $params);

        $data['message'] = 'Your item was cancel successfully';
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
