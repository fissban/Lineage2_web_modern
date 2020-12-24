<?php

include("./database/mysql.php");
$db = new ConnectDB();

$data =
    [
        "type" => "wrong",
        "message" => ""
    ];


if (!isset($_POST['user'], $_POST['pass']))
{
    $data['message'] = "NO!!";
    echo json_encode($data);
    return;
}

$user = trim($_POST['user']);
$pass_notEncrypt = trim($_POST['pass']);

if (!ctype_alnum($user) || !ctype_alnum($pass_notEncrypt))
{
    $data['message'] = "Only letters and numbers are allowed";
    echo json_encode($data);
    return;
}

if (strlen($user) < 3)
{
    $data['message'] = "Username is too short";
    echo json_encode($data);
    return;
}
if (strlen($pass_notEncrypt) < 3)
{
    $data['message'] = "Password is too short";
    echo json_encode($data);
    return;
}

if (strlen($user) > 12)
{
    $data['message'] = "The username is too long";
    echo json_encode($data);
    return;
}
if (strlen($pass_notEncrypt) > 12)
{
    $data['message'] = "The password is too long";
    echo json_encode($data);
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
    $data['message'] = "The account already exists, try another.";
    echo json_encode($data);
    return;
}

$result = $db->executeQueryParams("INSERT INTO accounts (login,password) VALUES (?,?)", [$user, $pass]);

if ($result)
{
    $data['message'] = "your account was successfully registered";
    echo json_encode($data);
    return;
}

$data['message'] = "Theres been a problem";
echo json_encode($data);


function randomString($size)
{
    $value = "";

    for ($x = 0; $x < $size; $x++)
    {
        $value .= chr(rand(65, 90));
    }

    return $value;
}
