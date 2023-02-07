import { NextFunction } from "express";
/**
 * This function will take the ip address from the request header and add it to the request body.
 * @param {any} req - any - This is the request object that is passed to the middleware function.
 * @param res - Express.Response - The response object
 * @param {NextFunction} next - This is a function that you call when you want to move on to the next
 * middleware.
 */
export default function ipValidation(req: any, _: Express.Response, next: NextFunction) {
    const ipAddress = req.header('x-forwarded-for') || req.socket.remoteAddress;
    req.body.ip = ipAddress
    console.log(ipAddress)
    next()
}