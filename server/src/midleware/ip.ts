import { Express, NextFunction } from "express";
export default function ipValidation(req: any, res: Express.Response, next: NextFunction) {
    const ipAddress = req.header('x-forwarded-for') || req.socket.remoteAddress;

}