import { Router } from "express";
import { StorageController } from "./StorageController";

const storageRoute = Router(),
      storageController = new StorageController()

storageRoute.get("/:filename", storageController.view)

export default storageRoute;