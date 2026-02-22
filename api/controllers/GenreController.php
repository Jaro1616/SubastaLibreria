<?php
class genre
{
    //http://localhost:81/SubastaLibreria/api/genre
    public function index()//todos los generos
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $genero = new GenreModel();
            $result = $genero->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }

    //http://localhost:81/SubastaLibreria/api/genre/1
    public function get($param)//genero por id
    {
        try {
            $response = new Response();
            $genero = new GenreModel();
            $result = $genero->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }

    //http://localhost:81/SubastaLibreria/api/genre/getGenreBook/1
    public function getGenreBook($id)//generos de un libro
    {
        try {
            $response = new Response();
            $genero = new GenreModel();
            $result = $genero->getGenreBook($id);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }

    //NO SIRVE 
    //http://localhost:81/SubastaLibreria/api/genre/getBooksbyGenre/1
    public function getBooksbyGenre($param)//libros por genero
    {
        try {
            $response = new Response();
            $genero = new GenreModel();
            $result = $genero->getBooksbyGenre($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }
}
