<?php

/**
 * Clase sencilla para crear una nueva coneccion a la base de datos.
 */
class ConnectDB
{
    public $dbh;

    function __construct()
    {
        // Configs
        $servername = "localhost";
        $username = "root";
        $password = "";
        $database = "acis-la2swert";

        // coneccion a la base de datos con PDO
        $dsn = "mysql:host=localhost;dbname=$database";
        $this->dbh = new PDO($dsn, $username, $password);
        $this->dbh->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    }

    /**
     * Si la consulta contiene datos sensibles por favor usar 'executeQueryParams'
     */
    public function executeQuery($query)
    {
        $stmt = $this->dbh->prepare($query);
        // Execute
        $stmt->execute();
        // Especificamos el fetch mode antes de llamar a fetch()
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        // se retorna el resultado del query
        return $stmt;
    }

    /**
     * Si la consu
     */
    public function executeQueryParams($query, $params)
    {
        $stmt = $this->dbh->prepare($query);

        $count = 0;
        foreach ($params as &$param)
        {
            //echo $param;
            $stmt->bindParam(++$count, $param);
        }

        // Execute
        $stmt->execute();
        // Especificamos el fetch mode antes de llamar a fetch()
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        // se retorna el resultado del query
        return $stmt;
    }

    /**
     * Se previene la ejecucion de codigo malicioso en las consultas a la DB
     */
    public function scape($value)
    {
        if (!isset($value))
        {
            return "";
        }
        $value = trim($value); // Elimina espacios antes y después de los datos
        $value = stripslashes($value); // Elimina backslashes \
        $value = htmlspecialchars($value); // Traduce caracteres especiales en entidades HTML
        return $value;
    }
}
