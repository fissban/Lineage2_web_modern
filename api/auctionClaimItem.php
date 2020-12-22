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

if (!isset($_POST['id'], $_POST['claimer_id']))
{
    echo 'faltan parametros';
    return;
}

$id         = $_POST['id'];
$claimer_id = $_POST['claimer_id'];

$data =
    [
        'type'   => 'SUCCESS',
        'message' => ''
    ];

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

$result = $db->executeQueryParams("SELECT * FROM characters WHERE obj_Id=?", [$claimer_id]);
while ($row = $result->fetch())
{
    if ($row['online'] == 1)
    {
        $data['type'] = 'WARNING';
        $data['message'] = 'Your character must be offline in order to claim an item.';
        echo json_encode($data);
        return;
    }
}
// se busca en la DB el item que se intenta pedir la recompenza.
$result = $db->executeQuery("SELECT * FROM auction_items_sold WHERE ($condition) AND id='$id' LIMIT 1");

// usamos while porq no se que otra cosa usar pero solo traera 1 item porq asi es el query y mas no se pueden leer desde la DB.
while ($row = $result->fetch())
{
    // se obtiene un nuevo id
    $resultNewId = $db->executeQuery("SELECT MIN(object_id) AS minimum FROM items");
    while ($rowNewId = $resultNewId->fetch())
    {
        // TODO deberiamos chequear si insertar un item o actualizarlo???
        $params =
            [
                $claimer_id,
                $rowNewId['minimum'] - 1,
                $row['price_id'],
                $row['item_count'] * $row['price_count'],
                0,
                'INVENTORY',
                0,
                1606711688883,
            ];
        $db->executeQueryParams("INSERT INTO items(owner_id, object_id, item_id, count, enchant_level, loc, loc_data, time) VALUES (?,?,?,?,?,?,?,?)", $params);


        // se borra el item del registro del auction
        $db->executeQueryParams("DELETE FROM auction_items_sold WHERE id=?", [$id]);


        $data['type'] = 'SUCCESS';
        $data['message'] = 'Your reward is successfully claimed';
        echo json_encode($data);
        return;
    }
}

// si llegamos a este punto es porq no se encontro el item que se quiere vender en la DB
$data['type'] = 'WARNING';
$data['message'] = 'You are trying to claim an item that is not yours';
echo json_encode($data);
