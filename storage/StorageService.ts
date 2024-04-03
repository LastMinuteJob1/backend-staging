import { Request, Response } from "express";
import { storage_path } from "../app";
import path from "path";
import { ACCESS_KEY, SECRET_KEY } from "../src/config/env";
import { log } from "console";
import { S3Client } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";

const fs = require("fs");

export class StorageService {

    private accessKeyId = ACCESS_KEY;
    private secretAccessKey = SECRET_KEY;
    private endpoint = 'https://us-sea-1.linodeobjects.com/';
    private bucketName = 'job-pics';

    private s3Client = new S3Client({
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
      endpoint: this.endpoint,
      region: 'us-sea-1',
    });

    public uploadPicture = async (file:any, fileName:any) => {
      let stream = fs.createReadStream(file.path);
      const upload = new Upload({
        client: this.s3Client,
        params: {
          Bucket: this.bucketName,
          Key: fileName,
          Body: stream, 
          ContentType: file.mimetype,
          ACL: 'public-read'
        },
      });

      try {
        const uploadResponse = await upload.done();
        console.log('Picture uploaded successfully:', uploadResponse);
        return {status: true, data: uploadResponse};
      } catch (error) {
        console.error('Error uploading picture:', error);
        return {status: false, data: null};
      }
    }

    public view = async (req:Request, res:Response) => {
        try {
            const filePath = path.join(storage_path, req.params.filename);
        
            // Validate file existence and permissions
            if (!fs.existsSync(filePath)) {
              return res.status(404).send('File not found');
            }
        
            const fileStats = fs.statSync(filePath);
            if (!fileStats.isFile()) {
              return res.status(400).send('Not a file');
            }
        
            // Check for image files
            const extension = path.extname(filePath).toLowerCase();
            if (!['.jpg', '.jpeg', '.png', '.gif'].includes(extension)) {
              // Handle non-image files as downloads
              res.setHeader('Content-Type', 'application/octet-stream');
              res.setHeader('Content-Disposition', `attachment; filename="${req.params.filename}"`);
              fs.createReadStream(filePath).pipe(res);
              return;
            }
        
            // Set image content type
            res.setHeader('Content-Type', `image/${fileStats.mimetype?.split('/')[1]}`);
        
            // Stream the image content
            const readStream = fs.createReadStream(filePath);
            readStream.pipe(res);
          } catch (error) {
            console.error(error);
            res.status(500).send('Internal server error');
          }
    }

}