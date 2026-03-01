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
}
export default new BookService();
