import { NextFunction, Request, Response, Router } from "express"
import { UPLOADER_CONFIGURATION } from ".."
import useConfig, { getData, io, listData } from "../server"
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import fs from "fs"
import writeLogs, { readLogs } from "../utils/logHandler";

dotenv.config()
const routes = Router()

routes.get('/', (_req, res) => {
    res.sendFile('admin.html', { root: '../client/dist' })
})

routes.post('/login', async (req, res) => {
    if (req.body.password !== "1") return res.status(401).json({ 'message': 'gagal login' })
    const token = jwt.sign({ user: req.body.username }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: 60 * 5 })
    // if(!useConfig()) readLogs
    return res.status(200).json({ 'message': 'logged successfuly', token, expires: Date.now() + (1000 * 60 * 5) })
})

routes.post('/config', authenticateToken, (req, res) => {
    useConfig(req.body as UPLOADER_CONFIGURATION)
    if (!fs.existsSync(useConfig()!.dir)) return res.status(404).json({ message: "Directory not found" })
    if (!fs.existsSync(useConfig()!.dir + "\\log.json")) writeLogs(useConfig()!)
    else readLogs(useConfig()!.dir + "\\log.json").then((json) => {
        listData.setAll(parseDataLogs(json))
        writeLogs(useConfig()!,listData.getAll())
        io.emit('config', JSON.stringify(useConfig()))
        // useConfig(parseConfigLogs(json) ?? useConfig());
    })
 
    res.status(200).json({ message: "updated" }).end()
})

export default routes
function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHader = req.headers['authorization']
    const token = authHader?.split(' ')[1]
    if (!token || token === "undefined") return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
        if (err) return res.sendStatus(403)
        req.body.username = user
        next()
    })
}

function parseConfigLogs(json: any) {
    const data = JSON.parse(json) ?? null
    delete data.last_modified
    delete data.data
    return data
}


function parseDataLogs(json: any) {
    const data = JSON.parse(json)
    return data.data
}