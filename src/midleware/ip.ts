import { NextFunction, Request, Response } from "express";
import { useGlobalConfig } from "../utils/globalConfig";


/**
 * If the global config is not set to use ip validation, then just continue to the next middleware. If
 * it is set to use ip validation, then check if the ip address is in the list of allowed ip addresses.
 * If it is, then add the ip address to the request body and continue to the next middleware. If it is
 * not, then return a 403 error
 * @param {Request} req - Request - The request object
 * @param {Response} res - Response - The response object
 * @param {NextFunction} next - This is a function that you call when you want to move on to the next
 * middleware.
 * @returns the next() function.
 */


export default function ipValidation(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const ipAddress = req.header("x-forwarded-for") || req.socket.remoteAddress || "127.0.0.1"
  req.body.ip = ipAddress!
  
	if(ipAddress !== "127.0.0.1" ){
		if (!ipAddress || !useGlobalConfig()?.list_allowed_ip.includes(ipAddress))
			return res.status(403).json({ message: "Ip address not permitted" });
	}
	
  return next();
}
