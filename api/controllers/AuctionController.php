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

    //POST Crear
    //http://localhost:81/SubastaLibreria/api/auction/create
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $auction = new AuctionModel();
            //Acción del modelo a ejecutar
            $result = $auction->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);  
        }
    }

    //PUT actualizar
    //http://localhost:81/SubastaLibreria/api/auction/update
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $auction = new AuctionModel();
            //Acción del modelo a ejecutar
            $result = $auction->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    //PUT eliminar
    //http://localhost:81/SubastaLibreria/api/auction/delete/1
    public function delete($id)//subasta por id
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $auction = new AuctionModel();
            //Acción del modelo a ejecutar
            $result = $auction->delete($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
}