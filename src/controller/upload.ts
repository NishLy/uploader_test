import path from "path";
import { Request, Response } from "express";
import {
  deleteFileAsync,
  createDirectoryAsync,
  copyFileAsyncBuffer,
} from "../lib/file";
import printLog, { LOGTYPE } from "../lib/logger";
import { useConfig, listUpload, io, getData } from "../server";
import writeJSON from "../utils/logHandler";
import { useGlobalConfig } from "../utils/globalConfig";


export interface UPLOAD_INTERFACE {
  nim: string;
  name: string;
  file_name: string;
  kode_soal?: string | undefined;
  ip: string;
  file_data: FileList;
}

/**
 * It takes a data object and a file name, and returns an array of two strings.
 * @param {UPLOAD_INTERFACE} data - data_interface = {
 * @param {string} fileName - string = "test.jpg"
 * @returns An array of two strings.
 */
const getPath = (data: UPLOAD_INTERFACE, fileName: string): string[] => {
  const config = useConfig();
  let filePath = `${data!.nim}_${config?.kelas}_${config?.matkul}`;
  if (config?.format_name === 2)
    filePath = `${filePath}_${data!.kode_soal ?? ""}`;
  if (config?.format_name === 3) filePath = `${  parseInt((data!.ip as string).split(".")[3]) - parseInt((useGlobalConfig()?.list_allowed_ip[0] as string).split(".")[3])}_${filePath}_${data!.kode_soal ?? ""}`;
  filePath = filePath.toUpperCase() + path.extname(fileName);
  return [config?.dir + "/" + filePath, filePath];
};

export const uploadFileController = async (req: Request, res: Response) => {
  /* A timer that will delete the file if the response is sent within 5 seconds. */
  const interval = setInterval(() => {
    if (!res.headersSent) return;
    if (!req.file) return;
    deleteFileAsync("./uploads/" + req.file!.filename).catch((err) => {
      printLog(err, LOGTYPE.failed);
    });
    clearInterval(interval);
  }, 5000);

  /* Checking if the configuration exists, if the file exists, and if the upload is overdue. */
  if (!useConfig())
    return res.status(501).json({ message: "configuration does not exist" });
  if (!req.file) return res.status(404).json({ message: "file not uploaded" });
  if (new Date(useConfig()!.end).getTime() - new Date().getTime() <= 0)
    return res.status(403).json({ message: "upload overdue" });

  /* A type declaration. */
  const config = useConfig();
  const body: UPLOAD_INTERFACE = { ...req.body, ip: req.header("x-forwarded-for") || req.socket.remoteAddress };

  /* Checking if the user has already uploaded a file. */
  if (listUpload.get(body.nim))
    return res.status(403).json({ message: "user NIM already exists" });

  /* It creates a directory. */
  const data = await createDirectoryAsync(
    "./uploads/" + req.file!.filename
  ).catch((err) => {
    printLog(err, LOGTYPE.failed);
    return res.status(500).send(err);
  });

  /* Checking if the data is not null. */
  if (!data) return res.status(500).end();

  /* Copying a file from one location to another. */
  copyFileAsyncBuffer(
    "./uploads/" + req.file!.filename,
    getPath(body, req.file!.originalname)[0]
  ).catch((err) => {
    printLog(err, LOGTYPE.failed);
    return res.status(500).send(err);
  });

  //   /* Deleting the file. */
  //   deleteFileAsync("./uploads/" + req.file!.filename).catch((err) => {
  //     printLog(err, LOGTYPE.failed);
  //     return res.status(500).send(err);
  //   });

  /* Adding the data to the listData object. */
  listUpload.append({
    file_name: getPath(body, req.file!.originalname)[1],
    date: Date.now(),
    name: body.name,
    nim: body.nim,
  });
  io.emit("data-upload", JSON.stringify(getData() ?? {}));
  writeJSON(config!, listUpload.getAll());
  printLog(`nim : ${body.nim} successfuly upload file`, LOGTYPE.success);
  /* Returning a response to the client. */

  return res.status(200).json({ message: "Upload Berhasil" }).end();
};

export const deleteFileController = async (req: Request, res: Response) => {
  if (listUpload.getAll().length === 0 || !listUpload.get(req.body.nim))
    return res.status(404).json({ message: "file not exists" });
  /* Deleting a file. */
  deleteFileAsync(
    useConfig()!.dir + "/" + listUpload.get(req.body.nim)?.file_name
  ).catch((err) => {
    printLog(err, LOGTYPE.failed);
    return res.status(404).json({ message: "failed to delete the file" });
  });

  /* Deleting the file and updating the data. */
  listUpload.remove(req.body.nim);
  io.emit("data-upload", JSON.stringify(getData() ?? {}));
  writeJSON(useConfig()!, listUpload.getAll());
  printLog(`nim : ${req.body.nim} successfuly delete file `, LOGTYPE.success);

  return res.status(200).json({ message: "deleted successfuly" });
};
