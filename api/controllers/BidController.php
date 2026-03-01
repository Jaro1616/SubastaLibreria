<?php
class bid
{
    //http://localhost:81/SubastaLibreria/api/bid
    public function index()//todos los generos
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $bid = new BidModel();
            $result = $bid->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }

    //http://localhost:81/SubastaLibreria/api/bid/1
    public function get($param)//genero por id
    {
        try {
            $response = new Response();
            $bid = new BidModel();
            $result = $bid->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
}