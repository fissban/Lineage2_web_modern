<?php

$server_ip = '45.235.98.19';

$data =
    [
        "login" => 0,
        "game"  => 0,
    ];

$login = @fsockopen($server_ip, 2106, $err1, $err2, 0.5);
$game = @fsockopen($server_ip, 7777, $err1, $err2, 0.5);

if ($login)
{
    $data["login"] = 1;
}
if ($game)
{
    $data["game"] = 1;
}

echo json_encode($data);
