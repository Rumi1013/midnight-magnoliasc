import AWS from 'aws-sdk';

// Configure Wasabi S3-compatible storage
const wasabi = new AWS.S3({
  endpoint: 'https://s3.wasabisys.com',
  accessKeyId: process.env.WASABI_ACCESS_KEY,
  secretAccessKey: process.env.WASABI_SECRET_KEY,
  region: 'us-east-1', // Wasabi uses us-east-1 as default
  s3ForcePathStyle: true,
});

export class WasabiStorage {
  constructor(bucketName = process.env.WASABI_BUCKET_NAME) {
    this.bucketName = bucketName;
  }

  async uploadFile(key, fileBuffer, contentType = 'application/octet-stream') {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: fileBuffer,
        ContentType: contentType,
        ACL: 'public-read', // Adjust based on your needs
      };

      const result = await wasabi.upload(params).promise();
      return {
        success: true,
        url: result.Location,
        key: result.Key,
      };
    } catch (error) {
      console.error('Wasabi upload error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async deleteFile(key) {
    try {
      const params = {
        Bucket: this.bucketName,
        Key: key,
      };

      await wasabi.deleteObject(params).promise();
      return { success: true };
    } catch (error) {
      console.error('Wasabi delete error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  async listFiles(prefix = '') {
    try {
      const params = {
        Bucket: this.bucketName,
        Prefix: prefix,
      };

      const result = await wasabi.listObjectsV2(params).promise();
      return {
        success: true,
        files: result.Contents || [],
      };
    } catch (error) {
      console.error('Wasabi list error:', error);
      return {
        success: false,
        error: error.message,
      };
    }
  }

  getFileUrl(key) {
    return `https://s3.wasabisys.com/${this.bucketName}/${key}`;
  }
}

export default new WasabiStorage(); 