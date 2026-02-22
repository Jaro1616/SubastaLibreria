<?php
class GenreModel
{
    public $enlace;
    public function __construct()
    {
        $this->enlace = new MySqlConnect();
    }

    public function all()
    {
        //Consulta sql
        $vSql = "SELECT * FROM genre;";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado;
    }

    public function get($id)
    {
        //Consulta sql
        $vSql = "SELECT * FROM genre where id=$id";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado[0];
    }

    public function getGenreBook($idBook)
    {
        //Consulta sql
        $vSql = "SELECT g.id,g.title 
            FROM genre g,book_genre bg 
            where bg.genre_id=g.id and bg.book_id=$idBook";
        //Ejecutar la consulta
        $vResultado = $this->enlace->ExecuteSQL($vSql);
        // Retornar el objeto
        return $vResultado;
    }

    public function getBooksbyGenre($param)
    {
        $vResultado = null;
        if (!empty($param)) {
            $vSql = "SELECT m.id, m.title, m.author, m.isbn, m.publisher, m.year, m.description
				FROM book_genre mg, book m 
				where mg.book_id=m.id and mg.genre_id=$param";
            $vResultado = $this->enlace->ExecuteSQL($vSql);
        }
        // Retornar el objeto
        return $vResultado;
    }
}
