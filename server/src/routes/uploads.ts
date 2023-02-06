import { Router } from "express";
import path from "path";
import useConfig, { getData, io, listData } from "../server";
import multer from "multer"
import fs from "fs"
import writeLogs, { printLog } from "../utils/logHandler";

let upload = multer({ dest: path.join(__dirname, "temp/") })
const routes = Router()

interface data_interface { nim: string, name: string, file_name: string, kode_soal?: string | undefined, ip_pc?: number, file_data: FileList }

routes.post('/', upload.single("file-data"), async (req, res) => {
    if (!useConfig()) return res.status(501).send('Config Not yet Created');
    if (!req.file) return res.status(404).send('File not found');

    const config = useConfig()
    const { body }: { body: data_interface } = req
    console.log(req.file)
    if (listData.get(body.nim)) return res.status(403)
    if (fs.existsSync(path.join(__dirname, "temp", req.file!.filename))) {
        console.log(req.file)
        if (!fs.existsSync(config!.dir)) {
            fs.mkdir(config!.dir, { recursive: true }, (err) => {
                if (err) {
                    printLog(err)
                    return res.status(500)
                }
            })
        }
        fs.copyFile(path.join(__dirname, "temp", req.file!.filename), getPath(body, req.file.originalname)[0], (err) => {
            if (err) return res.status(500).send(err)
            console.log("req")
            fs.unlink(path.join(__dirname, "temp", req.file!.filename), (err) => {
                io.emit('data-upload', JSON.stringify(getData() ?? {}))
                if (err) printLog("cannot delete " + path.join(__dirname, "temp", req.file!.filename))
                listData.append({ file_name: getPath(body, req.file!.originalname)[1], date: Date.now(), name: body.name, nim: body.nim, })
                writeLogs(config!, listData.getAll());
                return res.status(200)
            })
        })
    }
    return res.status(404).end()
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