import { DATA_INTERFACE } from "../interfaces/data"
import { UPLOADER_CONFIGURATION } from "../interfaces/configuration"
import { createDirectoryAsync } from "../lib/file"
import fs from "fs"

/**
 * This function takes a configuration object and an optional array of data objects and writes the
 * configuration object to a file in the directory specified in the configuration object.
 * @param {UPLOADER_CONFIGURATION} config - UPLOADER_CONFIGURATION = {
 * @param {DATA_INTERFACE[]} [data] - DATA_INTERFACE[] = [{
 * @returns A promise that resolves to undefined.
 */
const writeLogUploader = async (config: UPLOADER_CONFIGURATION, data?: DATA_INTERFACE[]) => {
    const logConfig = { ...config, last_modified: new Date().getTime(), data: data ?? [] }
    await createDirectoryAsync(config.dir)
        .catch(err => {
            console.log(err)
        })
    console.log(fs.existsSync(config.dir + "\\log.json"))
    return fs.writeFileSync(config.dir + "\\log.json", JSON.stringify(logConfig))
}

// /**
//  * It checks if the file exists, if it does, it writes to it, if it doesn't, it appends to it
//  * @param {string} path - The path to the file you want to write to.
//  * @param {string} error - string - The error message
//  */
// const writeErrorLog = (path: string, error: string) => {
//     fs.existsSync(path) ? fs.writeFile(path, `${new Date().toISOString()} -> ${error}`, (err) => {
//         err && console.log(err + " Failed to write error logs!!")
//     }) :
//         fs.appendFile(path, `${new Date().toISOString()} -> ${error}`, (err) => {
//             console.log('apendd?')
//             err && console.log(err + " Failed to write error logs!!")
//         })
// }

export default writeLogUploader