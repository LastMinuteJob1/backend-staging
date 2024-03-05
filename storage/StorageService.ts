import { Request, Response } from "express";
import { storage_path } from "../app";
import path from "path";

const fs = require("fs")

export class StorageService {

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