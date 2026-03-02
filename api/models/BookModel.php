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

}
