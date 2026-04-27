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

	public function update($objeto)
	{
		//Consulta sql
        $sql = "Update user SET name ='$objeto->name'," .
            "email ='$objeto->email', active = $objeto->active" .
            " Where id =$objeto->id";
		//Ejecutar la consulta
        $cResults = $this->enlace->executeSQL_DML($sql);
		return $this->get($objeto->id);
	}

	public function create($objeto)
	{
		if (isset($objeto->password) && $objeto->password != null) {
			$crypt = password_hash($objeto->password, PASSWORD_BCRYPT);
			$objeto->password = $crypt;
		}
		//Consulta sql            
		$vSql = "Insert into user (name,email,password,rol_id,active)" .
			" Values ('$objeto->name','$objeto->email','$objeto->password',$objeto->rol_id ,$objeto->active)";

		//Ejecutar la consulta
		$vResultado = $this->enlace->executeSQL_DML_last($vSql);
		// Retornar el objeto creado
		return $this->get($vResultado);
	}

	public function login($objeto)
	{
		$vSql = "SELECT * from User where email='$objeto->email'";
		//Ejecutar la consulta
		$vResultado = $this->enlace->ExecuteSQL($vSql);
		if (is_object($vResultado[0])) {
			$user = $vResultado[0];
			if (password_verify($objeto->password, $user->password)) {
				$usuario = $this->get($user->id);
				if (!empty($usuario)) {
					// Datos para el token JWT
					$data = [
						'id' => $usuario->id,
						'email' => $usuario->email,
						'rol' => $usuario->rol,
						'iat' => time(),  // Hora de emisión
						'exp' => time() + 3600 // Expiración en 1 hora
					];

					// Generar el token JWT
					$jwt_token = JWT::encode($data, config::get('SECRET_KEY'), 'HS256');

					// Enviar el token como respuesta
					return $jwt_token;
				}
			}
		} else {
			return false;
		}
	}

	//VALIDACIONES Y DATOS EXTRA
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
