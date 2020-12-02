<?php

include("./database/mysql.php");
$db = new ConnectDB();

if (!isset($_POST['user'], $_POST['pass']))
{
    echo 'que fea la actitud';
    return;
}

$user = trim($_POST['user']);
$pass_notEncrypt = trim($_POST['pass']);

if (!ctype_alnum($user) || !ctype_alnum($pass_notEncrypt))
{
    echo 'solo se permiten letras y numeros';
    return;
}

if (strlen($user) < 5)
{
    echo 'el nombre de usuario es muy corto';
    return;
}
if (strlen($pass_notEncrypt) < 5)
{
    echo 'el password es muy corto';
    return;
}

// Estos valores no deben ser cambiados almenos que realmente sepas que estas haciendo xD
$base = "$2a$10$";
$rndString = randomString(21);
$rndSalt = randomString(4);

$pass = crypt($pass_notEncrypt, $base . $rndString . $rndSalt . "$");

// Se verifica si el nombre de usuario o email ya esta en uso
$result = $db->executeQuery("SELECT login FROM accounts WHERE login='$user' LIMIT 1");

while ($row = $result->fetch())
{
    echo 'La cuenta ya existe, intenta con otra.';
    return;
}

$result = $db->executeQuery("INSERT INTO accounts (login, password) VALUES ('$user' , '$pass')");

echo 'su cuenta se registro con exito';


function randomString($size)
{
    $value = "";

    for ($x = 0; $x < $size; $x++)
    {
        $value .= chr(rand(65, 90));
    }

    return $value;
}
