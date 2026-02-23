import axios from 'axios';
//http://localhost:81/SubastaLibreria/api/book
const BASE_URL = import.meta.env.VITE_BASE_URL + 'book';
class BookService {
  //Definición para Llamar al API y obtener el listado de libros

  //Listas peliculas
  //http://localhost:81/SubastaLibreria/api/book
  getBooks() {
    return axios.get(BASE_URL);
  }
  //Obtener pelicula
  //http://localhost:81/SubastaLibreria/api/book/1
  getBookById(BookId){
    return axios.get(BASE_URL+'/'+BookId);
  }
  
  /*
  //Obtener peliculas por tienda
  //http://localhost:81/appmovie/api/movie/moviesByShopRental/1
  getMovieByShopRental(ShopRentalId){
    return axios.get(BASE_URL+'/moviesByShopRental/'+ShopRentalId);
  }
  createMovie(Movie) {
    return axios.post(BASE_URL, JSON.stringify(Movie));
  }
  
  updateMovie(Movie) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(Movie)

    })
  }
  */
}
export default new BookService();
