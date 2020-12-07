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

if (strlen($user) < 3)
{
    echo 'el nombre de usuario es muy corto';
    return;
}
if (strlen($pass_notEncrypt) < 3)
{
    echo 'el password es muy corto';
    return;
}

if (strlen($user) > 12)
{
    echo 'el nombre de usuario es muy largo';
    return;
}
if (strlen($pass_notEncrypt) > 12)
{
    echo 'el password es muy largo';
    return;
}

// Estos valores no deben ser cambiados almenos que realmente sepas que estas haciendo xD
$base = "$2a$10$";
$rndString = randomString(21);
$rndSalt = randomString(4);

$pass = crypt($pass_notEncrypt, $base . $rndString . $rndSalt . "$");

// Se verifica si el nombre de usuario o email ya esta en uso
$result = $db->executeQueryParams("SELECT login FROM accounts WHERE login=? LIMIT 1", [$user]);

while ($row = $result->fetch())
{
    echo 'La cuenta ya existe, intenta con otra.';
    return;
}

$result = $db->executeQueryParams("INSERT INTO accounts (login,password) VALUES (?,?)", [$user, $pass]);

if ($result)
{
    echo 'su cuenta se registro con exito';
}
else
{
    echo 'ocurrio un problema';
}

function randomString($size)
{
    $value = "";

    for ($x = 0; $x < $size; $x++)
    {
        $value .= chr(rand(65, 90));
    }

    return $value;
}
