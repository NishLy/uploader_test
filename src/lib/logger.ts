import chalk from "chalk"
import fs from "fs"
import { useGlobalConfig } from "../utils/globalConfig"

import { appendFileAsync, writeFileAsync } from "./file"

export enum LOGTYPE {
    success,
    warning,
    failed,
}

const printLog = async (log: string, type: LOGTYPE = LOGTYPE.success) => {
    if (!log) return
    if (!useGlobalConfig()!.logToConsole) console.log = () => null
    
    printToConsole(log, type)
    let logString = "";
    if (type === 0) logString = `${new Date().toISOString()} -> % ${log}}`;
    if (type === 1) logString = `${new Date().toISOString()} -> % ${log}}`;
    if (type === 2) logString = `${new Date().toISOString()} -> % ${log}}`;

    if (!await fs.existsSync("./log.txt")) return writeFileAsync("./log.txt", logString)
    return appendFileAsync("./log.txt", "\n" + logString)
}


const printToConsole = (log: string, type: LOGTYPE) => {
    if (type === 0) return console.log(chalk.greenBright("%s  ->  %s"), new Date().toISOString(), log)
    if (type === 1) return console.log(chalk.yellowBright("%s  ->  %s"), new Date().toISOString(), log)
    if (type === 2) return console.log(chalk.redBright("%s  ->  %s"), new Date().toISOString(), log)
}


export default printLog