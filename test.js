process.env.S3_KEY_ID = 'oDWgKxttn5gLd3iBIYH7';
process.env.S3_SECRET_KEY = '-1uidzTAZaWur-KDEIn_BZh5dpgiUWRBZGZjFl9P';
const YandexS3 = require('./index');
const s3 = new YandexS3({
    keyId: process.env.S3_KEY_ID,
    secretKey: process.env.S3_SECRET_KEY,
    verbose: true,
});

s3.deleteBucket("migger-1609598199541").then(console.log);
