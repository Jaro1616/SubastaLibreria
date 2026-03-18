import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'user';

class UserService {
  getUsers() {
    return axios.get(BASE_URL);
  }
  getUserById(UserId) {
    return axios.get(BASE_URL + '/' + UserId);
  }

  getAdminById() {
    return axios.allAdmin(BASE_URL);
  }

  getSellerById() {
    return axios.allSeller(BASE_URL);
  }

  getBuyerById() {
    return axios.allBuyer(BASE_URL);
  }

  updateUser(User) {
    return axios({
      method: 'put',
      url: BASE_URL,
      data: JSON.stringify(User)
    })
  }

}

export default new UserService();
