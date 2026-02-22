<?php
class rol{
    //http://localhost:81/SubastaLibreria/api/rol
    public function index()//todos los roles
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

    //http://localhost:81/SubastaLibreria/api/rol/1
    public function get($id)//rol por id
    {
        try {
            $response = new Response();
            $rol = new RolModel();
            $result = $rol->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    //http://localhost:81/SubastaLibreria/api/rol/getRolUser/1
    public function getRolUser($idUser)//rol de usario por id de usuario
    {
        try {
            $response = new Response();
            $rol = new RolModel();
            $result = $rol->getRolUser($idUser);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

}