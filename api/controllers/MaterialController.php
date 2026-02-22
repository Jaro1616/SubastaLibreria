<?php
class material
{
    //http://localhost:81/SubastaLibreria/api/material
    public function index()//todos los materiales
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $material = new MaterialModel();
            $result = $material->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }

    //http://localhost:81/SubastaLibreria/api/material/1
    public function get($param)//material por id
    {
        try {
            $response = new Response();
            $material = new MaterialModel();
            $result = $material->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
}