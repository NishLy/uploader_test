import { Router } from "express";
import path from "path";
import useConfig, { getData, io, listData } from "../server";
import multer from "multer"
import fs from "fs"
import writeLogs, { createDirectory, printLog } from "../utils/logHandler";

let upload = multer({ dest: path.join(__dirname, "temp/") })
const routes = Router()

interface data_interface { nim: string, name: string, file_name: string, kode_soal?: string | undefined, ip_pc?: number, file_data: FileList }


routes.delete("/", (req, res) => {
    if (listData.getAll().length === 0) return res.status(404)
    if (!listData.get(req.body.nim)) return res.status(404)
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


routes.post('/', upload.single("file-data"), async (req, res) => {
    if (!useConfig()) return res.status(501).send('Config Not yet Created');
    if (!req.file) return res.status(404).send('File not found');

    const config = useConfig();
    const body: data_interface = req.body;
    console.log("dah");
    if (listData.get(body.nim)) return res.status(403).end()
    console.log("dah");
    createDirectory(path.join(__dirname, "temp", req.file!.filename)).then(data => {
        if (!data) return res.status(500).end()
        fs.copyFile(path.join(__dirname, "temp", req.file!.filename), getPath(body, req.file!.originalname)[0], (err) => {
            if (err) return res.status(500).send(err)
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



const getPath = (data: data_interface, fileName: string): string[] => {
    const config = useConfig()
    let filePath = `${data!.nim}_${config?.kelas}_${config?.matkul}`
    if (config?.format_name === 2) filePath = `${filePath}_${data!.kode_soal ?? ""}`
    if (config?.format_name === 3) filePath = `${data!.ip_pc ?? ""}_${filePath}`
    filePath = filePath.toUpperCase() + path.extname(fileName)
    return [config?.dir + "\\" + filePath, filePath]
}


export default routes