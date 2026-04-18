<?php
class payment
{
    //http://localhost:81/SubastaLibreria/api/payment
    public function index()//todos los pagos
    {
        try {
            $response = new Response();
            //Obtener el listado del Modelo
            $payment = new PaymentModel();
            $result = $payment->all();
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }

    //http://localhost:81/SubastaLibreria/api/payment/1
    public function get($param)//pago por id
    {
        try {
            $response = new Response();
            $payment = new PaymentModel();
            $result = $payment->get($param);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);
            
        }
    }

    //POST Crear
    //http://localhost:81/SubastaLibreria/api/payment/create
    public function create()
    {
        try {
            $request = new Request();
            $response = new Response();
            //Obtener json enviado
            $inputJSON = $request->getJSON();
            //Instancia del modelo
            $payment = new PaymentModel();
            //Acción del modelo a ejecutar
            $result = $payment->create($inputJSON);
            //Dar respuesta
            $response->toJSON($result);
        } catch (Exception $e) {
            $response->toJSON($result);
            handleException($e);  
        }
    }
}