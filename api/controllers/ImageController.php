<?php
class image{
    //http://localhost:81/SubastaLibreria/api/image
    public function create()//crear imagen
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputFILE = $request->getBody();
            //Instancia del modelo
            $imagen = new ImageModel();
            //Acción del modelo a ejecutar
            $result = $imagen->uploadFile($inputFILE);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }

    //http://localhost:81/SubastaLibreria/api/image/1
    public function get($idBook)//obtener imagen por id de libro
    {
        try {
            $response = new Response();
            $imagen = new ImageModel();
            $result = $imagen->getImageBook($idBook);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
}