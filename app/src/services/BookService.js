import axios from 'axios';
//http://localhost:81/SubastaLibreria/api/book
const BASE_URL = import.meta.env.VITE_BASE_URL + 'book';
class BookService {
  //Definición para Llamar al API y obtener el listado de libros

  //Listas libros
  //http://localhost:81/SubastaLibreria/api/book
  getBooks() {
    return axios.get(BASE_URL);
  }
  //Obtener libro
  //http://localhost:81/SubastaLibreria/api/book/1
  getBookById(BookId){
    return axios.get(BASE_URL+'/'+BookId);
  }
  //Crear libro 
  //http://localhost:81/SubastaLibreria/api/book/create
  createBook(Book) {
    return axios.post(BASE_URL, JSON.stringify(Book));
  }
}
export default new BookService();
