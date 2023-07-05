import clear from "clear";
import chalk from "chalk";
import figlet from "figlet";
import inquirer from "inquirer";
import fs from "fs";
import crypto from "crypto";

import printLog, { LOGTYPE } from "./lib/logger";
import { useGlobalConfig } from "./utils/globalConfig";


(async function () {
  /* Just a fancy way to print the text in the console. */
  clear();
  console.log(
    chalk.blue(
      figlet.textSync("UPLOADER UPT", {
        font: "3D-ASCII",
        horizontalLayout: "default",
      })
    )
  );



  let config = await inquirer
    .prompt([
      {
        name: "passwordlab",
        type: "password",
        message: "Masukan Password uploader",
        validate(input) {
          if (input !== "upt") return "Password Salah!";
          return true;
        },
      },
      {
        name: "lab",
        type: "rawlist",
        message: "Pilih Lab :",
        choices: ["LAB1", "LAB2", "LAB3", "LAB4", "LAB5", "LAB6", "LAB7"],
      },
      {
        name: "ipvalidation",
        type: "confirm",
        message: "Hidupkan validasi IP?",
      },
      {
        name: "ip",
        type: "input",
        message: "Masukan prefiks ip contoj '192.162.20'",
        validate(input) {
          return input.split(".").length === 3 ? true : "Format Salah"
        },
        when(answers) {
          return answers.ipvalidation === true
        },
      },
      {
        name: "iprange",
        type: "input",
        message: "Masukan range ip host constoh '100 - 200'",
        validate(input) {
          return input.split("-").length === 2 ? true : "Format Salah"
        },
        when(answers) {
          return answers.ipvalidation === true
        },
      },
      {
        name: "logToConsole",
        type: "confirm",
        message: "Hidupkan verbose logging?",
      },
      {
        name: "port",
        type: "input",
        message: "Masukan Port (kosongkan untuk default port 3000)",
        validate: (value) => {
          if (value.length === "") return true;
          if (isNaN(value)) return "PORT Harus angka";
          return true;
        },
      },
      {
        name: "pass",
        type: "input",
        message: "Masukan password untuk konfigurasi web uploader ",
      },
    ])
    .catch((err) => printLog(err, LOGTYPE.warning));


  fs.writeFileSync(
    ".env",
    `ACCESS_TOKEN_SECRET=${crypto.randomBytes(64).toString("hex")} 
    PASSWORD=${config.pass}
    NODE_MODE=PRODUCTION 
    PORT=${config.port === "" ? "3000" : config.port}`
  );

  let ips: string[] = [];
  const [startIndex, endIndex] = config.iprange.split("-");

  for (let index = parseInt(startIndex.trim()); index < parseInt(endIndex.trim()); index++) {
    ips.push(config.ip + "." + index);
  }

  useGlobalConfig({
    lab: config.lab,
    last_open: Date.now(),
    last_config_dir: "",
    list_allowed_ip: ips,
    ipvalidation: config.ipvalidation,
    logToConsole: config.logToConsole,
  });

  clear();
  console.log(
    chalk.blue("Konfigurasi telah dibuat jalankan 'npm run start untuk menjalankan server'")
  );
})();
