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
        $bidA = new BidModel();
        //Consulta sql
        $vSql = "SELECT * FROM auction where id=$id";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        if (!empty($vResultado)) {
            $vResultado[0]->book = $bookA->get($vResultado[0]->book_id);
            $vResultado[0]->pujas_realizadas = $this->countPujasRealizadas($vResultado[0]->id);
            $vResultado[0]->bids = $bidA->getBidByAuction($vResultado[0]->id);
            $vResultado[0]->highest_bid = $bidA->getHighestBidByAuction($vResultado[0]->id);
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
        if (!empty($vResultado) && is_array($vResultado)) {
            return $vResultado[0];
        }
        return null;
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

    public function create($objeto)
    {
        //Consulta SQL
        $sql = "INSERT INTO auction (book_id, start_date, end_date, base_price, min_increment, status) " .
            "VALUES ($objeto->book_id, 
                        '$objeto->start_date', 
                        '$objeto->end_date', 
                        $objeto->base_price, 
                        $objeto->min_increment, 
                        'Pending')";

        //Ejecutar la consulta y obtener el último ID insertado
        $idAuction = $this->enlace->executeSQL_DML_last($sql);

        //Retornar la subasta creada
        return $this->get($idAuction);
    }

    public function update($objeto)
    {
        //Consulta SQL
        $sql = "UPDATE auction SET 
                    start_date = '$objeto->start_date',
                    end_date = '$objeto->end_date',
                    base_price = $objeto->base_price,
                    min_increment = $objeto->min_increment
                WHERE id = $objeto->id";

        //Ejecutar la consulta
        $cResults = $this->enlace->executeSQL_DML($sql);

        //Retornar subasta actualizada
        return $this->get($objeto->id);
    }

    public function delete($id)
    {
        $sql = "UPDATE auction SET status = 'Cancelled' WHERE id = $id";
        return $this->enlace->executeSQL_DML($sql);
    }
}