import { Request, Response } from "express";
import { StorageService } from "./StorageService";

export class StorageController {

    private _storageService = new StorageService();

    public view = async (req:Request, res:Response) => {
        await this._storageService.view(req, res)
    }

}

