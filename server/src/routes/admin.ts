import { Router } from "express"
import dotenv from "dotenv"
import authenticateToken from "../midleware/authentication";
import { adminConfigUpdateController, adminLoginController } from "../controller/admin"


dotenv.config()
const routes = Router()

/* A route that is used to serve the admin page. */
routes.get('/', (_req, res) => {
    res.sendFile('admin.html', { root: './dist/' })
})

/* A route that is used to login to the application. */
routes.post('/login', adminLoginController)

/* A route that is used to update the configuration of the application. */
routes.post('/config', authenticateToken, adminConfigUpdateController)

export default routes