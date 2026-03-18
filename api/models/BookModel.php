<?php
class BookModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        $imagenB = new ImageModel();
        $genreB = new GenreModel();
        $materialB = new MaterialModel();
        $editionB = new EditionModel();
        $userB = new UserModel();
        $auctionB = new AuctionModel();
        //Consulta SQL
        $vSQL = "SELECT * FROM book order by id desc;";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSQL);
        if(!empty($vResultado) && is_array($vResultado)){
            for ($i=0; $i < count($vResultado); $i++) { 
                //Imagen
                $vResultado[$i]->imagen=$imagenB->getImageBook($vResultado[$i]->id);
                //Generos - genres
                $vResultado[$i]->genres=$genreB->getGenreBook($vResultado[$i]->id);
                //Materiales - materials
                $vResultado[$i]->materials=$materialB->get($vResultado[$i]->material_id);
                //Ediciones - editions
                $vResultado[$i]->editions=$editionB->get($vResultado[$i]->edition_id);
                //Vendedor - seller
                $vResultado[$i]->seller=$userB->get($vResultado[$i]->seller_id);
                //Subasta - auction
                $vResultado[$i]->auction=$auctionB->getAuctionByBook($vResultado[$i]->id);
            }
        }
        //Retornar la respuesta
        return $vResultado;
    }

    public function get($id)
    {
        $imagenB = new ImageModel();
        $genreB = new GenreModel();
        $materialB = new MaterialModel();
        $editionB = new EditionModel();
        $userB = new UserModel();
        $auctionB = new AuctionModel();
        //Consulta SQL
        $vSql = "SELECT * FROM book
                    where id=$id;";
        //Ejecutar la consulta sql
        $vResultado = $this->enlace->executeSQL($vSql);
        if(!empty($vResultado)){
            $vResultado=$vResultado[0];
            //Imagen
            $vResultado->imagen=$imagenB->getImageBook($id);
            //Materiales - material
            $vResultado->material=$materialB->get($vResultado->material_id);
            //Generos-genres
            $vResultado->genres=$genreB->getGenreBook($id);            
            //Edicion - edition
            $vResultado->edition=$editionB->get($vResultado->edition_id);
            //Vendedor - seller
            $vResultado->seller=$userB->get($vResultado->seller_id);
            //Subasta - auction
            $vResultado->auction=$auctionB->getAuctionByBook($id);
        }
        //Retornar la respuesta
        return $vResultado;
    }

    /* public function create($objeto){

    }

    public function create($objeto)
    {
        //Consulta sql
        //Identificador autoincrementable
        $sql = "Insert into movie (title, year, time, lang, director_id)" .
            " Values ('$objeto->title','$objeto->year',
                    '$objeto->time','$objeto->lang',$objeto->director_id)";
        //Ejecutar la consulta
        //Obtener ultimo insert
        $idMovie = $this->enlace->executeSQL_DML_last($sql);
        //--- Generos ---
        //Crear elementos a insertar en generos
        foreach ($objeto->genres as $value) {
            $sql = "Insert into movie_genre(movie_id,genre_id)" .
                " Values($idMovie,$value)";
            $vResultadoGen = $this->enlace->executeSQL_DML($sql);
        }
        //--- Actores ---
        //Crear elementos a insertar en actores
        foreach ($objeto->actors as $item) {
            $sql = "Insert into movie_cast(movie_id,actor_id,role)" .
                " Values($idMovie,$item->actor_id, '$item->role')";
            $vResultadoAct = $this->enlace->executeSQL_DML($sql);
        }
        //Retornar pelicula
        return $this->get($idMovie);
    }

    public function update($objeto){

    }

    public function update($objeto)
    {
        //Consulta sql
        $sql = "Update movie SET title ='$objeto->title'," .
            "year ='$objeto->year',time ='$objeto->time',lang ='$objeto->lang'," .
            "director_id=$objeto->director_id" .
            " Where id=$objeto->id";
        //Ejecutar la consulta
        $cResults = $this->enlace->executeSQL_DML($sql);
        //--- Generos ---
        //Eliminar generos asociados a la pelicula
        $sql = "Delete from movie_genre where movie_id=$objeto->id";
        $vResultadoD = $this->enlace->executeSQL_DML($sql);
        //Insertar generos
        foreach ($objeto->genres as $item) {
            $sql = "Insert into movie_genre(movie_id,genre_id)" .
                " Values($objeto->id,$item)";
            $vResultadoG = $this->enlace->executeSQL_DML($sql);
        }
        //--- Actores ---
        //Eliminar actores asociados a la pelicula
        $sql = "Delete from movie_cast where movie_id=$objeto->id";
        $vResultadoD = $this->enlace->executeSQL_DML($sql);
        //Crear actores
        foreach ($objeto->actors as $item) {
            $sql = "Insert into movie_cast(movie_id,actor_id,role)" .
                " Values($objeto->id, $item->actor_id, '$item->role')";
            $vResultadoA = $this->enlace->executeSQL_DML($sql);
        }

        //Retornar pelicula
        return $this->get($objeto->id);
    } */
}
