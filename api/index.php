<?php
// Composer autoloader
require_once 'vendor/autoload.php';
/*Encabezada de las solicitudes*/
/*CORS*/
header("Access-Control-Allow-Origin: * ");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");
header('Content-Type: application/json');

/*--- Requerimientos Clases o librerías*/
require_once "controllers/core/Config.php";
require_once "controllers/core/HandleException.php";
require_once "controllers/core/Logger.php";
require_once "controllers/core/MySqlConnect.php";
require_once "controllers/core/Request.php";
require_once "controllers/core/Response.php";
//Middleware
require_once "middleware/AuthMiddleware.php";


/***--- Agregar todos los modelos*/
require_once "models/RolModel.php";
require_once "models/UserModel.php";
require_once "models/ImageModel.php";
require_once "models/GenreModel.php";
require_once "models/MaterialModel.php";
require_once "models/EditionModel.php";
require_once "models/BookModel.php";
require_once "models/BidModel.php";
require_once "models/AuctionModel.php";

/***--- Agregar todos los controladores*/
require_once "controllers/RolController.php";
require_once "controllers/UserController.php";
require_once "controllers/ImageController.php";
require_once "controllers/GenreController.php";
require_once "controllers/MaterialController.php";
require_once "controllers/EditionController.php";
require_once "controllers/BookController.php";
require_once "controllers/BidController.php";
require_once "controllers/AuctionController.php";

//Enrutador
require_once "routes/RoutesController.php";
$index = new RoutesController();
$index->index();



