<?php
class rol{
    public function index()
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $rol = new RolModel();
            $result = $rol->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
}