
import clear from "clear";
import chalk from "chalk";
import figlet from "figlet";
import { appendFileAsync, readFileAsync, writeFileAsync } from "./lib/file";
import inquirer, { QuestionCollection } from "inquirer";
import fs from "fs"
import crypto from "crypto"
import serve, { useConfig } from "./server";
import { parseConfigLogs } from "./utils/parseJSON";

interface GLOBAL_CONFIG {
    last_config_dir: string, lab: string, last_open: number, ipvalidation: boolean, list_allowed_ip: string[]
}

(async function () {
    /* Just a fancy way to print the text in the console. */
    clear()
    console.log(chalk.blue(figlet.textSync('UPLOADER UPT', {
        font: '3D-ASCII',
        horizontalLayout: 'default',
    })));

    /* It checks if the file exists. If it doesn't, it create new random token. */
    if (!fs.existsSync(".env")) writeFileAsync(".env", "ACCESS_TOKEN_SECRET=" + crypto.randomBytes(64).toString('hex'))


    /* Asking for a password. */
    const { ipvalidation } = await inquirer.prompt(<QuestionCollection>[
        {
            name: 'passwordlab',
            type: 'password',
            message: 'Masukan Password uploader',
            validate(input) {
                if (input !== "upt2022") return "Password Salah!"
                return true
            }
        }, {
            name: 'ipvalidation',
            type: 'confirm',
            message: 'Hidupkan validasi IP?',
        }])

    /* It checks if the file exists. If it doesn't, it calls the function createNewConfig(). */
    if (!fs.existsSync("./config.json")) return createNewConfig(ipvalidation)

    const config: GLOBAL_CONFIG = await JSON.parse(await readFileAsync("./config.json") as string);
    config.ipvalidation = ipvalidation

    /* It checks if the file exists. If it doesn't, it calls the function createNewConfig(). */
    if (config.last_config_dir === "" || !fs.existsSync(config.last_config_dir + "\\log.json")) {
        useGlobalConfig(config)
        return serve()
    }

    /* Asking for a confirmation. */
    const confirm = await inquirer.prompt([
        {
            name: 'confirmReplace',
            type: 'confirm',
            message: 'lanjutkan uploader sebelumnya? -> ' + new Date(config.last_open).toISOString() + ' : ' + config.last_config_dir,
            validate(input) {
                if (input !== "upt2022") return "Password Salah!"
                return true
            },
        }])

    /* Checking if the file exists. If it doesn't, it calls the function createNewConfig(). */
    if (!confirm.confirmReplace) return serve()
    const localConfig = await parseConfigLogs(await readFileAsync(config.last_config_dir + "\\log.json"))

    useGlobalConfig(config)
    useConfig(localConfig)
    return serve()
}())

/**
 * It asks the user to select a lab, then writes the user's selection to a file, then runs a function
 * called serve().
 * @returns the result of the serve() function.
 */
async function createNewConfig(ipvalidation: boolean) {
    /* Asking the user to select a lab, then writes the user's selection to a file, then runs a function
     * called serve(). */
    let config = await inquirer.prompt([
        {
            name: 'lab',
            type: 'rawlist',
            message: 'Pilih Lab :',
            choices: ["LAB1", "LAB2", "LAB3", "LAB4", "LAB5", "LAB6", "LAB7"],
        },
        {
            name: 'port',
            type: 'input',
            message: 'Masukan Port (kosongkan untuk default port 3000)',
            validate: (value) => {
                if (value.length === "") return true
                if (isNaN(value)) return "PORT Harus angka"
                return true
            }
        }
    ]).catch(err => console.log(err));

    await appendFileAsync('.env', "\nPORT=" + config.port === "" ? "3000" : config.port)
    const { allowedIp } = await JSON.parse(await readFileAsync("./assets/ip.json") as string)
    const globalConfig: GLOBAL_CONFIG = { last_config_dir: "", lab: config.lab, last_open: Date.now(), ipvalidation, list_allowed_ip: allowedIp[config.lab] }
    useGlobalConfig(globalConfig)
    writeGlobalConfig(globalConfig)
    return serve()
}

/**
 * This function writes a global config file to the current directory, and if it fails, it logs the
 * error to the console.
 * @param {GLOBAL_CONFIG} config - GLOBAL_CONFIG
 */
function writeGlobalConfig(config: GLOBAL_CONFIG) {
    writeFileAsync("./config.json", JSON.stringify(config)).catch(err => console.log(err))
}

/**
 * If the config is not null, then set the globalConfig to the config, and write the globalConfig to
 * the localStorage.
 * @param {GLOBAL_CONFIG | null} [config=null] - GLOBAL_CONFIG | null = null
 * @returns The globalConfig variable is being returned.
 */
let globalConfig: GLOBAL_CONFIG | null = null
export default function useGlobalConfig(config: GLOBAL_CONFIG | null = null) {
    if (config) {
        globalConfig = config;
        writeGlobalConfig(globalConfig)
    }
    return globalConfig;
}
