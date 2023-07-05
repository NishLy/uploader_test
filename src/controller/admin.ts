import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getData, io, listUpload, useConfig } from "../server";
import { UPLOADER_CONFIGURATION } from "../interfaces/configuration";
import fs from "fs";
import dotenv from "dotenv";
import writeJSON from "../utils/logHandler";
import { parseDataLogs } from "../utils/parseJSON";

import printLog, { LOGTYPE } from "../lib/logger";
import bcrypt from "bcrypt";
import { useGlobalConfig } from "../utils/globalConfig";

dotenv.config();
let hash = "";
bcrypt.hash(
  process.env.PASSWORD ? process.env.PASSWORD : "tujuanupt",
  10,
  function (err, hashed) {
    if (err) {
      printLog(err.message, LOGTYPE.failed);
      return process.exit();
    }
    return (hash = hashed);
  }
);

/**
 * This function is used to check if the password entered by the user is correct. If it is not correct,
 * it will return an error message
 * @param {Request} req - Request - This is the request object that is sent by the client.
 * @param {Response} res - This is the response object that is used to send a response to the client.
 * @returns The token and the expiration time.
 */
export const adminLoginController = async (req: Request, res: Response) => {
  /* This is a function that is used to check if the password entered by the user is correct. If it
    is not correct, it will return an error message. */
  bcrypt.compare(req.body.password, hash).then(function (result) {
    if (!result) return res.status(401).json({ message: "gagal login" });
    /* This is a function that is used to generate a token that will be used to authenticate the user. */
    const token = jwt.sign(
      { username: req.body.username, password: req.body.password },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: 60 * 5 }
    );
    return res.status(200).json({
      message: "logged successfuly",
      token,
      expires: Date.now() + 1000 * 60 * 5,
    });
  });
};

/* This is a function that is used to update the configuration of the application. */
export const adminConfigUpdateController = (req: Request, res: Response) => {
  /* A function that is used to update the configuration of the application. */

  useConfig(req.body as UPLOADER_CONFIGURATION);

  /* Checking if the log.json file exists in the directory specified in the configuration. If it does
    not exist, it will create it. */
  if (!fs.existsSync(useConfig()!.dir + "/log.json")) writeJSON(useConfig()!);

  const json = fs.readFileSync(useConfig()!.dir + "/log.json");

  /* This is a function that is used to update the configuration of the application. */
  listUpload.setAll(parseDataLogs(json));
  writeJSON(useConfig()!, listUpload.getAll());
  useGlobalConfig({
    ...useGlobalConfig()!,
    lab: useGlobalConfig()!.lab,
    last_config_dir: useConfig()!.dir,
    last_open: Date.now(),
  });
  io.emit("config", JSON.stringify(useConfig()));
  io.emit("data-upload", JSON.stringify(getData() ?? {}));
  res.status(200).json({ message: "configuration updated" });
  printLog("success update konfigurasi", LOGTYPE.success);
};
