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
                //Flags
                $vResultado[$i]->isEditable = $vResultado[$i]->auction === null || $vResultado[$i]->auction->status !== 'Active';
                $vResultado[$i]->isDeletable = $vResultado[$i]->auction == null;
                //$vResultado[$i]->canToggle = $vResultado[$i]->auction == null;
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

            //Flags
            $vResultado->isEditable = $vResultado->auction === null || $vResultado->auction->status !== 'Active';
            $vResultado->isDeletable = $vResultado->auction == null;
            //$vResultado->canToggle = $vResultado->auction == null;
        }
        //Retornar la respuesta
        return $vResultado;
    }

    public function create($objeto)
    {
        //Consulta sql
        //Identificador autoincrementable
        $sql = "Insert into book (title, author, isbn, publisher, year, seller_id, material_id, edition_id, description, active)" .
            "VALUES ('$objeto->title', '$objeto->author', '$objeto->isbn', '$objeto->publisher',
                    '$objeto->year', $objeto->seller_id, $objeto->material_id,
                    $objeto->edition_id, '$objeto->description', 1 )";
        //Ejecutar la consulta
        //Obtener ultimo insert
        $idBook = $this->enlace->executeSQL_DML_last($sql);
        //--- Generos ---
        //Crear elementos a insertar en generos
        foreach ($objeto->genres as $genre) {
            $sql = "INSERT INTO book_genre (book_id, genre_id)" .
                "VALUES ($idBook, $genre)";
            $vResultadoGen = $this->enlace->executeSQL_DML($sql);
        }
        //Retornar libro creado
        return $this->get($idBook);
    }

    
    /* public function update($objeto){

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
