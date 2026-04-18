import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'payment';

class PaymentService {
    //Lista Pago
    //http://localhost:81/SubastaLibreria/api/payment
    getPayments() {
        return axios.get(BASE_URL);
    }

    //Obtener Pago
    //http://localhost:81/SubastaLibreria/api/payment/1
    getPaymentById(PaymentId) {
        return axios.get(BASE_URL + '/' + PaymentId);
    }

    //Crear pago
    //http://localhost:81/SubastaLibreria/api/payment/create
    createPayment(Payment) {
        return axios.post(BASE_URL, JSON.stringify(Payment));
    }
}

export default new PaymentService();