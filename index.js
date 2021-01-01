/**
 * @jest-environment node
 */

const axios = require('axios').create();
const {aws4Interceptor} = require("aws4-axios");


module.exports = class {
    constructor(options) {
        this.options = options;
        if (!options.region) {
            this.options.region = 'us-east-1';
        }
        axios.interceptors.request.use(aws4Interceptor({
            region: this.options.region,
            service: "s3"
        }, {
            accessKeyId: options.keyId,
            secretAccessKey: options.secretKey,
        }));
    }

    async upload(bucket, buffer, targetPath) {
        if(this.options.verbose) {
            console.log({bucket, buffer, targetPath});
        }
        return axios.put(`https://${bucket}.storage.yandexcloud.net/${targetPath}`, buffer, {
            validateStatus: (status) => {
                return true
            }
        }).then(async (response) => {
            if(response.status > 299) {
                console.log(response.status, "\n", response.data);
                throw new Error('Error while sending request');
            }
            if(this.options.verbose) {
                console.log(response.status, "\n", response.data);
            }
            return response.data;
        });
    }

    async download(bucket, buffer, targetPath) {
        if(this.options.verbose) {
            console.log({bucket, buffer, targetPath});
        }
        return axios.get(`https://${bucket}.storage.yandexcloud.net/${targetPath}`, {
            validateStatus: (status) => {
                return true
            }
        }).then(async (response) => {
            if(response.status > 299) {
                console.log(response.status, "\n", response.data);
                throw new Error('Error while sending request');
            }
            if(this.options.verbose) {
                console.log(response.status, "\n", response.data);
            }
            return response.data;
        });
    }
}
