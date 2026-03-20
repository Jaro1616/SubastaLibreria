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
  //Actualizar libro 
  //http://localhost:81/SubastaLibreria/api/book/update
  updateBook(Book) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(Book)

    })
  }
  //Eliminar libro
  //http://localhost:81/SubastaLibreria/api/book/delete/1
  deleteBook(BookId) {
    return axios.delete(`${BASE_URL}/delete/${BookId}`);
  }
}
export default new BookService();
