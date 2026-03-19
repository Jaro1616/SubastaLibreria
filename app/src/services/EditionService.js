import axios from 'axios';
const BASE_URL = import.meta.env.VITE_BASE_URL + 'edition';

class EditionService {
    getEditions() {
        return axios.get(BASE_URL);
    }

    getEditionById(EditionId) {
        return axios.get(BASE_URL + '/' + EditionId);
    }
}

export default new EditionService();