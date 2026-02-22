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
        //Consulta SQL
        $vSql = "SELECT * FROM book
                    where id=$id;";
        //Ejecutar la consulta sql
        $vResultado = $this->enlace->executeSQL($vSql);
        if(!empty($vResultado)){
            $vResultado=$vResultado[0];
            //Imagen
            $vResultado->imagen=$imagenB->getImageBook($id);
            //Director
            $vResultado->material=$materialB->get($vResultado->material_id);
            //Generos-genres
            $vResultado->genres=$genreB->getGenreBook($id);            
            //Actores - actors
            $vResultado->edition=$editionB->get($vResultado->edition_id);
        }
        //Retornar la respuesta
        return $vResultado;
    }

    








    /*
    public function moviesByShopRental($idShopRental)
    {
        $imagenM = new ImageModel();
        //Consulta SQL
        $vSQL = "SELECT m.*, i.price
                    FROM movie m, inventory i
                    where 
                    m.id=i.movie_id
                    and shop_id=$idShopRental
                    order by m.title desc";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSQL);

        //Incluir imagenes
        if (!empty($vResultado) && is_array($vResultado)) {
            for ($i = 0; $i < count($vResultado); $i++) {
                $vResultado[$i]->imagen = $imagenM->getImageMovie(($vResultado[$i]->id));
            }
        }
        //Retornar la respuesta

        return $vResultado;
    }
    public function moviesByActor($idActor)
    {
        $imagenM = new ImageModel();
        //Consulta SQL
        $vSQL = "SELECT m.* 
                FROM movie m, movie_cast mc, actor a 
                where a.id=mc.actor_id and m.id=mc.movie_id and mc.actor_id=$idActor";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSQL);
        //Retornar la respuesta

        return $vResultado;
    }

    public function create($objeto)
    {
        //Consulta sql
        
        //Ejecutar la consulta
        
        //Retornar pelicula
        
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
    }
    public function getCountByGenre($idGenre)
    {

        $vResultado = null;
        //Consulta sql
        $vSql = "SELECT count(bg.book_id) as 'Cantidad', g.title as 'Genero'
             FROM genre g
             INNER JOIN book_genre bg ON g.id = bg.genre_id
             INNER JOIN book b ON bg.book_id = b.id
             WHERE g.id = $idGenre
             GROUP BY g.id";

        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado;
    }

        */
}
