<?php
use Firebase\JWT\JWT;
class UserModel
{
	public $enlace;
	public function __construct()
	{
		$this->enlace = new MySqlConnect();
	}

	public function all()
	{
		$rolM = new RolModel();
		//Consulta sql
		$vSql = "SELECT * FROM user;";
		//Ejecutar la consulta
		$vResultado = $this->enlace->ExecuteSQL($vSql);
		if(!empty($vResultado) && is_array($vResultado)){
            for ($i=0; $i < count($vResultado); $i++) { 
                //Rol - roles
                $vResultado[$i]->rol=$rolM->get($vResultado[$i]->rol_id);
            }
        }
		// Retornar el objeto
		return $vResultado;
	}

	public function get($id)
	{
		$rolM = new RolModel();
		//Consulta sql
		$vSql = "SELECT * FROM user where id=$id";
		//Ejecutar la consulta
		$vResultado = $this->enlace->ExecuteSQL($vSql);
		if ($vResultado) {
			$vResultado = $vResultado[0];
			$rol = $rolM->getRolUser($id);
			$vResultado->rol = $rol;
			
			// Campos calculados
			$vResultado->subastas_creadas = $this->countSubastasCreadas($id);
			$vResultado->pujas_realizadas = $this->countPujasRealizadas($id);

			// Retornar el objeto
			return $vResultado;
		} else {
			return null;
		}
	}

	public function allAdmin()
	{
		//Consulta sql
		$vSql = "SELECT * FROM subasta_libros.user where rol_id=1;";
		//Ejecutar la consulta
		$vResultado = $this->enlace->ExecuteSQL($vSql);
		// Retornar el objeto
		return $vResultado;
	}

	public function allSeller()
	{
		//Consulta sql
		$vSql = "SELECT * FROM subasta_libros.user where rol_id=2;";
		//Ejecutar la consulta
		$vResultado = $this->enlace->ExecuteSQL($vSql);
		// Retornar el objeto
		return $vResultado;
	}

	public function allBuyer()
	{
		//Consulta sql
		$vSql = "SELECT * FROM subasta_libros.user where rol_id=3;";
		//Ejecutar la consulta
		$vResultado = $this->enlace->ExecuteSQL($vSql);
		// Retornar el objeto
		return $vResultado;
	}

	//LO DE LAS SUBASTAS
	public function countSubastasCreadas($userId)
	{
		$sql = "
			SELECT COUNT(*) AS total
			FROM auction a
			INNER JOIN book b ON b.id = a.book_id
			WHERE b.seller_id = $userId
		";
		$result = $this->enlace->ExecuteSQL($sql);
		return $result ? (int)$result[0]->total : 0;
	}

	public function countPujasRealizadas($userId)
	{
		$sql = "
			SELECT COUNT(*) AS total
			FROM bid
			WHERE customer_id = $userId
		";
		$result = $this->enlace->ExecuteSQL($sql);
		return $result ? (int)$result[0]->total : 0;
	}
}
