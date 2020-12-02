<?php

include("./database/mysql.php");
$db = new ConnectDB();

$user = "camille";
$pass_notEncrypt = "camille";

$result = $db->executeQuery("SELECT * FROM accounts WHERE login='$user' LIMIT 1");

while ($row = $result->fetch())
{
    if (!password_verify($pass_notEncrypt, $row['password']))
    {
        echo 'noooooooo';
    }
    else
    {
        echo 'seeeeeeeeeeeee';
    }
}

echo 'ufff';
