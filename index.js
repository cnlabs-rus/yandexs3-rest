const {parseString} = require('xml2js');
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

    async download(bucket, targetPath) {
        if(this.options.verbose) {
            console.log({bucket, targetPath});
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

    async delete(bucket, targetPath) {
        if(this.options.verbose) {
            console.log({bucket, targetPath});
        }
        return axios.delete(`https://${bucket}.storage.yandexcloud.net/${targetPath}`, {
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

    async createBucket(bucket) {
        if(this.options.verbose) {
            console.log({bucket});
        }
        return axios.put(`https://storage.yandexcloud.net/${bucket}`, null,{
            validateStatus: (status) => {
                return true
            },
            headers: {
                "x-amz-acl": 'private',
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

    async getBucketMeta(bucket) {
        if(this.options.verbose) {
            console.log({bucket});
        }
        return axios.head(`https://storage.yandexcloud.net/${bucket}`, {},{
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
    async deleteBucket(bucket) {
        if(this.options.verbose) {
            console.log({bucket});
        }
        const {data} = await axios.get(`https://${bucket}.storage.yandexcloud.net/`);
        const {ListBucketResult} = await new Promise((resolve, reject) => parseString(data, (e, d) => e && reject(e) || resolve(d)));
        await Promise.all(ListBucketResult.Contents.map(({Key}) => this.delete(bucket, Key)));
        return axios.delete(`https://storage.yandexcloud.net/${bucket}`, {
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
    async list(bucket, options) {
        if(this.options.verbose) {
            console.log({bucket, options});
        }
        return axios.get(`https://${bucket}.storage.yandexcloud.net/`, {
            params: options,
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
            return new Promise((resolve, reject) => parseString(response.data, (e, d) => e && reject(e) || resolve(d)));
        }).then(({ListBucketResult}) => ListBucketResult);
    }
}
