<?php

// Se inicializa la sesion
if (session_status() == PHP_SESSION_NONE)
{
    session_start();
}

if (!isset($_SESSION["isLogin"]))
{
    echo 'false';
    return;
}

echo $_SESSION["user"];
