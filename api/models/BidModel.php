<?php
class BidModel
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
        $vSql = "SELECT * FROM bid;";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado;
    }
    /*Obtener */
    public function get($id)
    {
        //Consulta sql
        $vSql = "SELECT * FROM bid where id=$id";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }

    /*Obtener */
    public function getBidByAuction($id)
    {
        $userB = new UserModel();
        //Consulta sql
        $vSql = "SELECT * FROM bid where auction_id=$id";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);

        if(!empty($vResultado) && is_array($vResultado)){
            for ($i=0; $i < count($vResultado); $i++) { 
                
                $vResultado[$i]->user=$userB->get($vResultado[$i]->customer_id);
            }
        }
        // Retornar el objeto
        return $vResultado;
    }
}