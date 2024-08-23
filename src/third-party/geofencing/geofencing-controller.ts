import { Request, Response } from "express";

import { GeofencingService } from "./geofencing-service"
import { sendResponse } from "../../helper/methods";

export class GeofencingController {
     
     private _geofencing_service = new GeofencingService()

    public list_provinces = async (req:Request, res: Response) => {
        let data = await this._geofencing_service.list_provinces()
        res.send(sendResponse(data))
    }

}