import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'material';

class MaterialService {
    getMaterials() {
        return axios.get(BASE_URL);
    }

    getMaterialById(MaterialId) {
        return axios.get(BASE_URL + '/' + MaterialId);
    }
}

export default new MaterialService();