import jwt from "jsonwebtoken";
import dotenv from "dotenv"
import { NextFunction, Request, Response } from "express"

dotenv.config()
/**
 * If the token is not present or is undefined, return a 401 status code. If the token is present,
 * verify it and if it is valid, add the user object to the request body and call the next function.
 * @param {Request} req - Request - The request object
 * @param {Response} res - Response - the response object
 * @param {NextFunction} next - NextFunction - This is a function that will be called when the
 * middleware is done.
 * @returns The user object is being returned.
 */
export default function authenticateToken(req: Request, res: Response, next: NextFunction): void | Response {
    const authHader = req.headers['authorization']
    const token = authHader?.split(' ')[1]

    if (!token || token === "undefined") return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET as string, (err, user) => {
        if (err) return res.status(403).json({ message: "token expired" })
        if (user) req.body = { ...req.body, ...user as object }
        return next()
    })
    return next()
}