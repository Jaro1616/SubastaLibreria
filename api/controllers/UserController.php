<?php
//Cargar todos los paquetes
require_once "vendor/autoload.php";
use Firebase\JWT\JWT;
class user
{
    //http://localhost:81/SubastaLibreria/api/user
    public function index()//Obtener todo
    {
        $response = new Response();
        //Obtener el listado del Modelo
        $usuario = new UserModel();
        $result = $usuario->all();
        //Dar respuesta
        $response->toJSON($result);
    }

    //http://localhost:81/SubastaLibreria/api/user/1
    public function get($id)//usuario por id
    {
        $response = new Response();
        $usuario = new UserModel();
        $result = $usuario->get($id);
        //Dar respuesta
        $response->toJSON($result);
    }

    //http://localhost:81/SubastaLibreria/api/user/allAdmin
    public function allAdmin()//Todos los administradores
    {
        $response = new Response();
        //Obtener el listado del Modelo
        $usuario = new UserModel();
        $result = $usuario->allAdmin();
        //Dar respuesta
        $response->toJSON($result);
    }

    //http://localhost:81/SubastaLibreria/api/user/allSeller
    public function allSeller()//Todos los vendedores
    {
        $response = new Response();
        //Obtener el listado del Modelo
        $usuario = new UserModel();
        $result = $usuario->allSeller();
        //Dar respuesta
        $response->toJSON($result);
    }

    //http://localhost:81/SubastaLibreria/api/user/allBuyer
    public function allBuyer()//Todos los compradores
    {
        $response = new Response();
        //Obtener el listado del Modelo
        $usuario = new UserModel();
        $result = $usuario->allBuyer();
        //Dar respuesta
        $response->toJSON($result);
    }

    //http://localhost:81/SubastaLibreria/api/user/update
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $usuario = new UserModel();
            //Acción del modelo a ejecutar
            $result = $usuario->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }

    //http://localhost:81/SubastaLibreria/api/user/create
    public function create()
    {
        $response = new Response();
        $request = new Request();
        //Obtener json enviado
        $inputJSON = $request->getJSON();
        $usuario = new UserModel();
        $result = $usuario->create($inputJSON);
        //Dar respuesta
        $response->toJSON($result);
    }

    //http://localhost:81/SubastaLibreria/api/user/login
    public function login()
    {
        $response = new Response();
        $request = new Request();
        //Obtener json enviado
        $inputJSON = $request->getJSON();
        $usuario = new UserModel();
        $result = $usuario->login($inputJSON);
        if (isset($result) && !empty($result) && $result != false) {
            $response->toJSON($result);
        } else {
            $response->toJSON($response, "Usuario no valido");
        }
    }
}
