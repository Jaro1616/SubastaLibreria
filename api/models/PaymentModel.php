<?php
class PaymentModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    /*Listar */
    public function all()
    {
        //Consulta sql
        $vSql = "SELECT * FROM payment;";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado;
    }
    /*Obtener */
    public function get($id)
    {
        //Consulta sql
        $vSql = "SELECT * FROM payment where id=$id";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }

    public function create($objeto)
    {
        //Consulta SQL
        $sql = "INSERT INTO payment (auction_id, customer_id, total, status) " .
            "VALUES ($objeto->auction_id, 
                        $objeto->customer_id, 
                        $objeto->total, 
                        '$objeto->status')";

        //Ejecutar la consulta y obtener el último ID insertado
        $idAuction = $this->enlace->executeSQL_DML_last($sql);

        //Retornar el pago creado
        return $this->get($idAuction);
    }
}