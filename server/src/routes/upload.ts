import { Router } from "express";
import path from "path";
import { getData, io, listData, useConfig } from "../server";
import multer from "multer"
import writeJSON from "../utils/logHandler";
import { copyFileAsync, createDirectoryAsync, deleteFileAsync } from "../lib/file";

let upload = multer({ dest: "./uploads/" })
const routes = Router()

interface data_interface { nim: string, name: string, file_name: string, kode_soal?: string | undefined, ip_pc?: number, file_data: FileList }

/* A function that is called when the user wants to delete a file. */
routes.delete("/", async (req, res) => {
    if (listData.getAll().length === 0 || !listData.get(req.body.nim)) return res.status(404)
    /* Deleting a file. */
    await deleteFileAsync(useConfig()!.dir + "\\" + listData.get(req.body.nim)?.file_name).catch(err => { return res.status(500).send(err) })

    listData.remove(req.body.nim)
    io.emit('data-upload', JSON.stringify(getData() ?? {}))
    writeJSON(useConfig()!, listData.getAll())

    return res.status(200).json({ message: "deleted successfuly" })

})

//* A function that is called when the user uploads a file. */
routes.post('/', upload.single("file-data"), async (req, res) => {
    /* Checking if the configuration exists, if the file exists, and if the upload is overdue. */
    if (!useConfig()) return res.status(501).json({ message: "configuration not exist" })
    if (!req.file) return res.status(404).json({ message: "file not uploaded" })
    if (new Date(useConfig()!.end).getTime() - new Date().getTime() <= 0) return res.status(403).json({ message: "upload overdue" })

    const config = useConfig();
    const body: data_interface = req.body;

    /* Checking if the user has already uploaded a file. */
    if (listData.get(body.nim)) return res.status(403).end()

    const data = await createDirectoryAsync("./uploads/" + req.file!.filename).catch(err => { return res.status(500).send(err) })

    /* Checking if the data is not null. */
    if (!data) return res.status(500).end()

    /* Copying a file from one location to another. */
    await copyFileAsync("./uploads/" + req.file!.filename, getPath(body, req.file!.originalname)[0]).catch(err => { return res.status(500).send(err) })

    /* Deleting the file. */
    await deleteFileAsync("./uploads/" + req.file!.filename).catch(err => { return res.status(500).send(err) })

    /* Adding the data to the listData object. */
    listData.append({ file_name: getPath(body, req.file!.originalname)[1], date: Date.now(), name: body.name, nim: body.nim, });
    io.emit('data-upload', JSON.stringify(getData() ?? {}));
    writeJSON(config!, listData.getAll());

    /* Returning a response to the client. */
    return res.status(200).json({ message: "Upload Berhasil" }).end();
})


/**
 * It takes a data object and a file name, and returns an array of two strings.
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