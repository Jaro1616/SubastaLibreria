import axios from 'axios';

//http://localhost:81/SubastaLibreria/api/bid
const BASE_URL = import.meta.env.VITE_BASE_URL + 'bid';
class BidService {
  //Definición para Llamar al API y obtener el listado de libros

  //Listas Subastas
  //http://localhost:81/SubastaLibreria/api/bid
  getBids() {
    return axios.get(BASE_URL);
  }
  //Obtener Subasta
  //http://localhost:81/SubastaLibreria/api/bid/1
  getBidById(BidId){
    return axios.get(BASE_URL+'/'+BidId);
  }

  //Obtener Subasta por libro
  //http://localhost:81/SubastaLibreria/api/bid/getBidByAuction/1
  getBidByAuction(AuctionId){
    return axios.get(BASE_URL+'/getBidByAuction/'+AuctionId);
  }
}
export default new BidService();