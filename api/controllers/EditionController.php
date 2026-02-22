<?php
class edition
{
    //http://localhost:81/SubastaLibreria/api/edition
    public function index()//todas las ediciones
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $edition = new EditionModel();
            $result = $edition->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }

    //http://localhost:81/SubastaLibreria/api/edition/1
    public function get($param)//edicion por id
    {
        try {
            $response = new Response();
            $edition = new EditionModel();
            $result = $edition->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
}