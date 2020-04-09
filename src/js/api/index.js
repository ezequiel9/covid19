const axios = require('axios').default;

/**
 * URL
 * @type {string}
 */
const API_URL = 'https://01567818.ngrok.io/api';
// const API_URL = 'https://api.covid19argentina.com/api';


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








