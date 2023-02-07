import fs from "fs"
import { UPLOADER_CONFIGURATION, DATA_INTERFACE } from ".."
import useConfig from "../server"

export const createDirectory = (path: string): Promise<boolean> => {
    return new Promise<boolean>((resolve, reject) => {
        if (!fs.existsSync(path)) {
            fs.mkdir(path, (err) => {
                printLog(err)
                if (err) reject(false);
            })
        }
        resolve(true)
    })
}

export const readFilesName = (path: string) => {
    if (!fs.existsSync(path)) return null
    fs.readdir(path, (err, files) => {
        return new Promise((resolve, rejects) => {
            if (!err) resolve(files)
            rejects(null)
        })
    });
}

export const readLogs = (path: string) => {
    return new Promise((resolve, rejects) => {
        fs.readFile(path, (err, data) => {
            if (err) return rejects(err)
            return resolve(data)
        })
    })
}

const writeLogs = async (config: UPLOADER_CONFIGURATION, data?: DATA_INTERFACE[]) => {
    const { uploader_name, format_name, end, file_types, kelas, matkul, dir } = config
    const logConfig = {
        uploader_name, matkul, kelas, dir, end, last_modified: new Date().getTime(), format_name, file_types, data: data ?? []
    }
    if (await !createDirectory(config.dir)) return console.log('error create logs')
    await fs.writeFile(config.dir + "\\log.json", JSON.stringify(logConfig), (err: any) => {
        return new Promise((resolve, rejects) => {
            if (!err) resolve(true)
            rejects(false)
        })
    })
}

const writeErrorLog = (path: string, error: string) => {
    fs.existsSync(path) ? fs.writeFile(path, `${new Date().toISOString()} -> ${error}`, (err) => {
        err && console.log(err + " Failed to write error logs!!")
    }) :
        fs.appendFile(path, `${new Date().toISOString()} -> ${error}`, (err) => {
            console.log('apendd?')
            err && console.log(err + " Failed to write error logs!!")
        })
}

export const printLog = (data: any) => {
    console.trace(`${new Date().toISOString()} -> ${data}`)
    writeErrorLog(useConfig()?.dir + "\\err.txt", data.toString())
}

export default writeLogs