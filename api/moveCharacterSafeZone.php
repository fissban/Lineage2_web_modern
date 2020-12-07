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

if (!isset($_GET['charName']))
{
    echo 'no char';
    return;
}

$user = $_SESSION["user"];
$charName = $_GET["charName"];

include("./database/mysql.php");
$db = new ConnectDB();

$result = $db->executeQuery("SELECT * FROM characters WHERE account_name='$user' AND char_name='$charName'");
while ($row = $result->fetch())
{
    if ($row['online'] == 1)
    {
        echo 'Debe deslogear primero el personaje';
        return;
    }

    $result = $db->executeQuery("UPDATE characters SET x='-84318', y='244579', z='-3730' WHERE char_name='$charName'");
    echo 'Su personaje ya se movio a una zona segura';
    return;
}

echo 'ocurrio un problema';
