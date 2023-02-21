import { Router } from "express";
import multer from "multer"
import { deleteFileController, uploadFileController } from "../controller/upload";

/* Creating a new instance of multer and a new instance of Router. */
const upload = multer({ dest: "./uploads/" })
const routes = Router()

/* A function that is called when the user wants to delete a file. */
routes.delete("/", deleteFileController)

//* A function that is called when the user uploads a file. */
routes.post('/', upload.single("file-data"), uploadFileController)


export default routes