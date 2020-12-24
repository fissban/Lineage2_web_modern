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

$user = $db->scape($_POST['user']);
$pass = $db->scape($_POST['pass']);

$result = $db->executeQueryParams("SELECT * FROM accounts WHERE login=? LIMIT 1", [$user]);

while ($row = $result->fetch())
{
    if (password_verify($pass, $row['password']))
    {
        // Se inicializa la sesion
        if (session_status() == PHP_SESSION_NONE)
        {
            session_start();
        }

        $_SESSION["isLogin"] = true;
        $_SESSION["user"] = $user;
        $data['type'] = "ok";
        echo json_encode($data);
        return;
    }
}

$data['message'] = "password or user wrong!";
echo json_encode($data);
