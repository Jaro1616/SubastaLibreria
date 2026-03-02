<?php
class AuctionModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }
    /*Listar */
    public function all()
    {
        $bookA = new BookModel();
        //Consulta sql
        $vSql = "SELECT * FROM auction;";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);

        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {
                $vResultado[$i]->book = $bookA->get($vResultado[$i]->book_id);
                $vResultado[$i]->pujas_realizadas = $this->countPujasRealizadas($vResultado[$i]->id);
            }
            
        }
        // Retornar el objeto
        return $vResultado;
    }
    /*Obtener */
    public function get($id)
    {
        $bookA = new BookModel();
        //Consulta sql
        $vSql = "SELECT * FROM auction where id=$id";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        if (!empty($vResultado)) {
            $vResultado[0]->book = $bookA->get($vResultado[0]->book_id);
            $vResultado[0]->pujas_realizadas = $this->countPujasRealizadas($vResultado[0]->id);
        }
        // Retornar el objeto
        return $vResultado[0];
    }

    /*Obtener Subasta por Libro */
    public function getAuctionByBook($id)
    {
        //Consulta sql
        $vSql = "SELECT * FROM auction where book_id=$id";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }

    public function countPujasRealizadas($auctionId)
    {
        $sql = "
			SELECT COUNT(*) AS total
			FROM bid
			WHERE auction_id = $auctionId
		";
		$result = $this->enlace->ExecuteSQL($sql);
		return $result ? (int)$result[0]->total : 0;
    }
}