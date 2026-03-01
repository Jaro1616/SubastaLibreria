<?php
class book
{
    //http://localhost:81/SubastaLibreria/api/book
    public function index()//todos los libros
    {
        try {
            $response = new Response();
            //Instancia modelo
            $bookM = new BookModel();
            //Método del modelo
            $result = $bookM->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }   

    //GET Obtener 
    //http://localhost:81/SubastaLibreria/api/book/1
    public function get($id)//libro por id
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $bookM = new BookModel();
            //Acción del modelo a ejecutar
            $result = $bookM->get($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    
    




    /* METDOS POR IMPLEMENTAR
     //Obtener peliculas por tienda
    public function moviesByShopRental($idShopRental)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $movie = new MovieModel();
            //Acción del modelo a ejecutar
            $result = $movie->moviesByShopRental($idShopRental);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
    
    //POST Crear
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $movie = new MovieModel();
            //Acción del modelo a ejecutar
            $result = $movie->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
    //PUT actualizar
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $movie = new MovieModel();
            //Acción del modelo a ejecutar
            $result = $movie->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }

    //Obtener cantidad de libros por genero
    //http://localhost:81/SubastaLibreria/api/book/countByGenre
    public function getCountByGenre($param)
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $book = new BookModel();
            //Acción del modelo a ejecutar
            $result = $book->getCountByGenre($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
        */
}
