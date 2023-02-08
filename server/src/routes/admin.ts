import { Response, Router } from "express"
import { UPLOADER_CONFIGURATION } from ".."
import { getData, io, listData, useConfig } from "../server"
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import fs from "fs"
import authenticateToken from "../midleware/authentication";
import writeJSON from "../utils/logHandler";
import { readFileAsync } from "../lib/file";
import { parseDataLogs } from "../utils/parseJSON";
import useGlobalConfig from "../App";


dotenv.config()
const routes = Router()

/* A route that is used to serve the admin page. */
routes.get('/', (_req, res) => {
    res.sendFile('admin.html', { root: '../client/dist' })
})

/* A route that is used to login to the application. */
routes.post('/login', async (req, res) => {
    /* This is a function that is used to check if the password entered by the user is correct. If it
    is not correct, it will return an error message. */
    if (req.body.password !== "tujuan") return res.status(401).json({ 'message': 'gagal login' })
    /* This is a function that is used to generate a token that will be used to authenticate the user. */
    const token = jwt.sign({ username: req.body.username, password: req.body.password }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: 60 * 5 })
    return res.status(200).json({ 'message': 'logged successfuly', token, expires: Date.now() + (1000 * 60 * 5) })
})

/* A route that is used to update the configuration of the application. */
routes.post('/config', authenticateToken, async (req, res) => {
    /* A function that is used to update the configuration of the application. */
    useConfig(req.body as UPLOADER_CONFIGURATION)

    /* Checking if the log.json file exists in the directory specified in the configuration. If it does
    not exist, it will create it. */
    if (!fs.existsSync(useConfig()!.dir + "\\log.json")) {
        await writeJSON(useConfig()!)
    }

    const json = await readFileAsync(useConfig()!.dir + "\\log.json")
    listData.setAll(parseDataLogs(json))
    writeJSON(useConfig()!, listData.getAll())
    useGlobalConfig({ ...useGlobalConfig()!, lab: useGlobalConfig()!.lab, last_config_dir: useConfig()!.dir, last_open: Date.now() })
    io.emit('config', JSON.stringify(useConfig()))
    io.emit('data-upload', JSON.stringify(getData() ?? {}), (response: Response) => console.log(response))
    res.status(200).json({ message: "updated" }).end()
})



export default routes