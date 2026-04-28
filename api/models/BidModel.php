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



    public function create($objeto)
    {
        //Consulta SQL
        $sql = "INSERT INTO bid (auction_id, customer_id, amount) " .
            "VALUES ($objeto->auction_id, 
                        $objeto->customer_id, 
                        $objeto->amount)";
        //Ejecutar la consulta y obtener el último ID insertado
        $idBid = $this->enlace->executeSQL_DML_last($sql);

        //-- PUSHER --//
        $auctionService = new AuctionModel(); 
        $subastaCompleta = $auctionService->get($objeto->auction_id);

        //Configurar App Keys
        $options = array(
            'cluster' => 'us2',
            'useTLS' => true
        );
        $pusher = new Pusher\Pusher(
            '2943894993f98c49710e',
            '0b21ccc30d2d7ae7836a',
            '2142888',
            $options
        );

        //Trigger
        //Canal: auction-ID, Evento: new-bid, Datos: la subasta completa
        $pusher->trigger("auction-" . $objeto->auction_id, 'new-bid', [
            'auction' => $subastaCompleta
        ]);
/*         try {
            $highestBid = $this->getHighestBidByAuction($objeto->auction_id);
            $userModel = new UserModel();
            $userLeading = $highestBid ? $userModel->get($highestBid->customer_id) : null;

            $options = array(
                'cluster' => 'us2',
                'useTLS' => true
            );
            $pusher = new Pusher\Pusher(
                '2943894993f98c49710e',
                '0b21ccc30d2d7ae7836a',
                '2142888',
                $options
            );

            // Solo enviar los datos esenciales
            $pusher->trigger("auction-" . $objeto->auction_id, 'new-bid', [
                'auction_id'   => (int)$objeto->auction_id,
                'highest_bid'  => $highestBid,
                'user_leading' => $userLeading,
                'amount'       => (float)$objeto->amount,
            ]);

        } catch (Exception $ePusher) {
            // Loguear el error de Pusher pero no interrumpir la respuesta
            error_log("Error de Pusher: " . $ePusher->getMessage());
            // Temporal para ver el error directo en la respuesta:
            file_put_contents('C:/xampp/htdocs/pusher_error.txt', $ePusher->getMessage());
        } */
        //-- PUSHER --//

        //Retornar la subasta creada
        return $this->get($idBid);

    }



    public function getHighestBidByAuction($auctionId)
    {
        $vSql = "SELECT * 
                FROM bid 
                WHERE auction_id = $auctionId 
                ORDER BY amount DESC 
                LIMIT 1";

        $vResultado = $this->enlace->ExecuteSQL($vSql);

        return !empty($vResultado) ? $vResultado[0] : null;
    }
}