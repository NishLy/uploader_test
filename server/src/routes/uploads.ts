import { Router } from "express";
import path from "path";
import useConfig, { getData, io, listData } from "../server";
import multer from "multer"
import fs from "fs"
import writeLogs, { createDirectory, printLog } from "../utils/logHandler";

let upload = multer({ dest: path.join(__dirname, "temp/") })
const routes = Router()

interface data_interface { nim: string, name: string, file_name: string, kode_soal?: string | undefined, ip_pc?: number, file_data: FileList }

/* A function that is called when the user wants to delete a file. */
routes.delete("/", (req, res) => {
    if (listData.getAll().length === 0 || !listData.get(req.body.nim)) return res.status(404)
   /* Deleting a file. */
    fs.unlink(useConfig()!.dir + "\\" + listData.get(req.body.nim)?.file_name, (err) => {
        if (err) {
            printLog(err)
            return res.status(500).end()
        }
        listData.remove(req.body.nim)
        io.emit('data-upload', JSON.stringify(getData() ?? {}))
        writeLogs(useConfig()!, listData.getAll())
        res.status(200).end()
    })
})

//* A function that is called when the user uploads a file. */
routes.post('/', upload.single("file-data"), async (req, res) => {
/* Checking if the configuration is exist, if the file is uploaded, and if the upload is overdue. */
    if (!useConfig()) return res.status(501).json({ message: "configuration not exist" })
    if (!req.file) return res.status(404).json({ message: "file not uploaded" })
    if (new Date(useConfig()!.end).getTime() - new Date().getTime() <= 0) return  res.status(403).json({ message: "upload overdue" })

    const config = useConfig();
    const body: data_interface = req.body;
    /* Checking if the data is already exist in the listData. */
    if (listData.get(body.nim)) return res.status(403).end()
    /* Creating a directory in the temp folder. */
    createDirectory(path.join(__dirname, "temp", req.file!.filename)).then(data => {
       /* Checking if the directory is created or not. */
        if (!data) return res.status(500).end()
        /* Copying the file from the temp folder to the destination folder. */
        fs.copyFile(path.join(__dirname, "temp", req.file!.filename), getPath(body, req.file!.originalname)[0], (err) => {
           /* Returning the error message to the client. */
            if (err) return res.status(500).send(err)
            /* Deleting the file in the temp folder. */
            fs.unlink(path.join(__dirname, "temp", req.file!.filename), (err) => {
                res.status(200).json({ message: "Upload Berhasil" }).end();
                if (err) printLog("cannot delete " + path.join(__dirname, "temp", req.file!.filename));
                listData.append({ file_name: getPath(body, req.file!.originalname)[1], date: Date.now(), name: body.name, nim: body.nim, });
                io.emit('data-upload', JSON.stringify(getData() ?? {}));
                writeLogs(config!, listData.getAll());
                return
            })
        });
    }
    )
})



/**
 * It takes a data object and a file name, and returns an array of two strings. 
 * 
 * The first string is the full path to the file, and the second string is the file name. 
 * 
 * The file name is generated from the data object, and the full path is generated from the data object
 * and the file name. 
 * 
 * The full path is generated from the data object and the file name because the file name is generated
 * from the data object. 
 * 
 * The file name is generated from the data object because the file name is generated from the data
 * object. 
 * 
 * The full path is generated from the data object and the file name because the file name is generated
 * from the data object. 
 * 
 * The file name is generated from the data object because the file name is generated from the data
 * object. 
 * 
 * The full path is generated from the data object
 * @param {data_interface} data - data_interface = {
 * @param {string} fileName - string = "test.jpg"
 * @returns An array of two strings.
 */
const getPath = (data: data_interface, fileName: string): string[] => {
    const config = useConfig()
    let filePath = `${data!.nim}_${config?.kelas}_${config?.matkul}`
    if (config?.format_name === 2) filePath = `${filePath}_${data!.kode_soal ?? ""}`
    if (config?.format_name === 3) filePath = `${data!.ip_pc ?? ""}_${filePath}`
    filePath = filePath.toUpperCase() + path.extname(fileName)
    return [config?.dir + "\\" + filePath, filePath]
}


export default routes