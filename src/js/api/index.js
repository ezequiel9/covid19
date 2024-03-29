const axios = require('axios').default;

/**
 * URL
 * @type {string}
 */
//const API_URL = 'https://local.covid19api/api';
const API_URL = 'https://covid19api.ezequielfernandez.com/api';


export default class Api{

    constructor() {
        this.endpoint = null;
    }

    getData() {
        return new Promise( (resolve, reject) => {
            axios.get(this.buildUrl())
                .then((response) => {
                    resolve(response);
                })
                .catch((error) => {
                    console.log(error);
                    reject(response);
                })
        });
    }

    buildUrl() {
        return API_URL + this.endpoint;
    }

    setEndpoint(endpoint) {
        this.endpoint = endpoint;
        return this;
    }


};








