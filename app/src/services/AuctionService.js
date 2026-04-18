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

  //Crear subasta 
  //http://localhost:81/SubastaLibreria/api/auction/create
  createAuction(Auction) {
    return axios.post(BASE_URL, JSON.stringify(Auction));
  }

  //Actualizar subasta 
  //http://localhost:81/SubastaLibreria/api/auction/update
  updateAuction(Auction) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(Auction)

    })
  }

  //Eliminar subasta
  //http://localhost:81/SubastaLibreria/api/auction/delete/1
  deleteAuction(AuctionId) {
    return axios.delete(`${BASE_URL}/delete/${AuctionId}`);
  }
  
  //Cerrar subasta
  //http://localhost:81/SubastaLibreria/api/auction/close/1
  closeAuction(AuctionId) {
    return axios.put(`${BASE_URL}/close/${AuctionId}`);
  }
}
export default new AuctionService();