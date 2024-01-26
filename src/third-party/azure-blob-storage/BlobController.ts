import { Request } from "express";
import { BlobService } from "./BlobService";

export class BlobController {
    
    private blobService = new BlobService()

    public uploadFile = async (req:Request) => {
        return this.blobService.uploadFile(req)
    }

}