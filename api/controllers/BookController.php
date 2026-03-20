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

    //POST Crear
    //http://localhost:81/SubastaLibreria/api/book/create
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $book = new BookModel();
            //Acción del modelo a ejecutar
            $result = $book->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);  
        }
    }
    
    //PUT actualizar
    //http://localhost:81/SubastaLibreria/api/book/update
    public function update()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $book = new BookModel();
            //Acción del modelo a ejecutar
            $result = $book->update($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }

    //PUT eliminar
    //http://localhost:81/SubastaLibreria/api/book/delete/1
    public function delete($id)//libro por id
    {
        try {
            $response = new Response();
            //Instancia del modelo
            $bookM = new BookModel();
            //Acción del modelo a ejecutar
            $result = $bookM->delete($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
        }
    }
}
