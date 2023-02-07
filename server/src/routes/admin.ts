import { NextFunction, Request, Response, Router } from "express"
import { UPLOADER_CONFIGURATION } from ".."
import useConfig, { getData, io, listData } from "../server"
import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import fs from "fs"
import writeLogs, { readLogs } from "../utils/logHandler";

dotenv.config()
const routes = Router()

/* A route that is used to serve the admin page. */
routes.get('/', (_req, res) => {
    res.sendFile('admin.html', { root: '../client/dist' })
})

/* A route that is used to login to the application. */
routes.post('/login', async (req, res) => {
    if (req.body.password !== "1") return res.status(401).json({ 'message': 'gagal login' })
    const token = jwt.sign({ username: req.body.username, password: req.body.password }, process.env.ACCESS_TOKEN_SECRET as string, { expiresIn: 60 * 5 })
    // if(!useConfig()) readLogs
    return res.status(200).json({ 'message': 'logged successfuly', token, expires: Date.now() + (1000 * 60 * 5) })
})

/* A route that is used to update the configuration of the application. */
routes.post('/config', authenticateToken, async (req, res) => {
    useConfig(req.body as UPLOADER_CONFIGURATION)
    if (!fs.existsSync(useConfig()!.dir + "\\log.json")) await writeLogs(useConfig()!)
    readLogs(useConfig()!.dir + "\\log.json").then((json) => {
        listData.setAll(parseDataLogs(json))
        writeLogs(useConfig()!, listData.getAll())
        io.emit('config', JSON.stringify(useConfig()))
        io.emit('data-upload', JSON.stringify(getData() ?? {}), (response: Response) => {
            console.log(response)
        })
    })
    res.status(200).json({ message: "updated" }).end()
})

export default routes

/**
 * If the token is not present or is undefined, return a 401 status code. If the token is present,
 * verify it and if it is valid, add the user object to the request body and call the next function.
 * @param {Request} req - Request - The request object
 * @param {Response} res - Response - the response object
 * @param {NextFunction} next - NextFunction - This is a function that will be called when the
 * middleware is done.
 * @returns The user object is being returned.
 */
function authenticateToken(req: Request, res: Response, next: NextFunction) {
    const authHader = req.headers['authorization']
    const token = authHader?.split(' ')[1]
    if (!token || token === "undefined") return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
        if (err) return res.sendStatus(403)
        if (user) {
            req.body = { ...req.body, ...user as object }
        }
        next()
    })
}

// function parseConfigLogs(json: any) {
//     if (!json) return null
//     const data = JSON.parse(json)
//     delete data.last_modified
//     delete data.data
//     return data
// }


/**
 * It takes a JSON string and returns the data property of the parsed JSON object
 * @param {any} json - any - the JSON string to parse
 * @returns The data.data property of the parsed JSON.
 */
function parseDataLogs(json: any) {
    if (!json) return null
    const data = JSON.parse(json) ?? null
    return data?.data
}