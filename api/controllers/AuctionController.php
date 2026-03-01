<?php
class auction
{
    //http://localhost:81/SubastaLibreria/api/auction
    public function index()//todos los generos
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $auction = new AuctionModel();
            $result = $auction->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }

    //http://localhost:81/SubastaLibreria/api/auction/1
    public function get($param)//genero por id
    {
        try {
            $response = new Response();
            $auction = new AuctionModel();
            $result = $auction->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }

    //http://localhost:81/SubastaLibreria/api/auction/getAuctionByBook/1
    public function getAuctionByBook($param)//genero por id
    {
        try {
            $response = new Response();
            $auction = new AuctionModel();
            $result = $auction->getAuctionByBook($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
}