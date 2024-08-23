import { Router } from "express";
import { GeofencingController } from "./geofencing-controller";

const geofencingRoute = Router(),
      geofencingController = new GeofencingController()

geofencingRoute.get("/list-provinces", geofencingController.list_provinces)

export default geofencingRoute