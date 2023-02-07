import fs from "fs"
import { UPLOADER_CONFIGURATION, DATA_INTERFACE } from ".."
import useConfig from "../server"

/**
 * It creates a directory if it doesn't exist
 * @param {string} path - The path to the directory you want to create.
 * @returns A promise that resolves to a boolean.
 */
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

/**
 * It returns a promise that resolves to an array of file names in the given path
 * @param {string} path - string - The path to the directory you want to read
 * @returns Nothing.
 */
export const readFilesName = (path: string) => {
    if (!fs.existsSync(path)) return null
    fs.readdir(path, (err, files) => {
        return new Promise((resolve, rejects) => {
            if (!err) resolve(files)
            rejects(null)
        })
    });
}

/**
 * It returns a promise that resolves to the data read from the file at the given path.
 * @param {string} path - string - The path to the file you want to read.
 * @returns A promise that resolves to the data read from the file.
 */
export const readLogs = (path: string) => {
    return new Promise((resolve, rejects) => {
        fs.readFile(path, (err, data) => {
            if (err) return rejects(err)
            return resolve(data)
        })
    })
}

/**
 * WriteLogs is an async function that takes in a config object and an optional data array, and returns
 * a promise that resolves to true if the log file is successfully written, and rejects to false if the
 * log file is not successfully written.
 * @param {UPLOADER_CONFIGURATION} config - UPLOADER_CONFIGURATION = {
 * @param {DATA_INTERFACE[]} [data] - DATA_INTERFACE[] = [{
 * @returns A promise that resolves to a boolean.
 */
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

/**
 * It checks if the file exists, if it does, it writes to it, if it doesn't, it appends to it
 * @param {string} path - The path to the file you want to write to.
 * @param {string} error - string - The error message
 */
const writeErrorLog = (path: string, error: string) => {
    fs.existsSync(path) ? fs.writeFile(path, `${new Date().toISOString()} -> ${error}`, (err) => {
        err && console.log(err + " Failed to write error logs!!")
    }) :
        fs.appendFile(path, `${new Date().toISOString()} -> ${error}`, (err) => {
            console.log('apendd?')
            err && console.log(err + " Failed to write error logs!!")
        })
}

/**
 * It takes a parameter of any type, converts it to a string, and then writes it to a file
 * @param {any} data - any - The data to be printed to the console and written to the log file.
 */
export const printLog = (data: any) => {
    console.trace(`${new Date().toISOString()} -> ${data}`)
    writeErrorLog(useConfig()?.dir + "\\err.txt", data.toString())
}

export default writeLogs