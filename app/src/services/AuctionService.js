import axios from 'axios';

//http://localhost:81/SubastaLibreria/api/auction
const BASE_URL = import.meta.env.VITE_BASE_URL + 'auction';
class AuctionService {
  //Definición para Llamar al API y obtener el listado de libros

  //Listas Subastas
  //http://localhost:81/SubastaLibreria/api/auction
  getAuctions() {
    return axios.get(BASE_URL);
  }
  //Obtener Subasta
  //http://localhost:81/SubastaLibreria/api/auction/1
  getAuctionById(AuctionId){
    return axios.get(BASE_URL+'/'+AuctionId);
  }

  //Obtener Subasta por libro
  //http://localhost:81/SubastaLibreria/api/auction/getAuctionByBook/1
  getBookByAuction(BookId){
    return axios.get(BASE_URL+'/getAuctionByBook/'+BookId);
  }
}
export default new AuctionService();