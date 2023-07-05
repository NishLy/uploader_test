/* Importing all the modules that are needed for the server to run. */
import express from "express";
import routesUpload from "./routes/upload";
import routesAdmin from "./routes/admin";
import bodyParser from "body-parser";
import listData from "./lib/list";
import { Server } from "socket.io";
import http from "http";
import ipValidation from "./midleware/ip";
import chalk from "chalk";
import figlet from "figlet";
import dotenv from "dotenv";
import { UPLOADER_CONFIGURATION } from "./interfaces/configuration";
import { DATA_JSON } from "./interfaces/data";
import fs from "fs";
import { GLOBAL_CONFIG, useGlobalConfig } from "./utils/globalConfig";

/* Creating a server and exporting it to be used in other files. */
dotenv.config();
const App = express();
const server = http.createServer(App);
const port = process.env.PORT || 3000;
export const publicPath =
  process.env.NODE_MODE === "development" ? "../client/build" : "./dist";
let localConfig: UPLOADER_CONFIGURATION | null = null;

console.log("Frontend -> " + publicPath);

export const io = new Server(server);
export const listUpload = new listData([]);

/* It's setting up the routes for the server. */
App.use(express.static(publicPath));
App.use(bodyParser.json());
App.use(ipValidation);
App.use("/upload", routesUpload);
App.use("/admin", routesAdmin);

/* It's serving the index.html file from the client/dist folder. */
App.get("/", ipValidation, (_, res) => {
  res.sendFile("index.html", { root: publicPath });
});

/* It's getting the config from the server. */
App.get("/config", (_, res) => {
  if (useConfig()) return res.json(useConfig());
  return res.status(404).end();
});

/* It's listening to the connection event and then it's emitting the data-upload and config events. */
io.on("connection", (socket) => {
  socket.emit("data-upload", JSON.stringify(getData() ?? {}));
  socket.emit("config", JSON.stringify(useConfig()));
});

/**
 * If the config is not set, return null. If it is set, return the data
 * @returns DATA_JSON | null
 */
export const getData = (): DATA_JSON | null => {
  if (!useConfig()) return null;
  return {
    last_fetched: Date.now(),
    kelas: useConfig()?.kelas ?? "undefined",
    matkul: useConfig()?.matkul ?? "undefined",
    data: listUpload.getAll(),
  };
};

server.listen({ port, host: "0.0.0.0" }, () => {
  console.log(chalk.green(figlet.textSync("listening on port " + port)));
  checkConfig();
});

function checkConfig() {
  if (!fs.existsSync("./config.json")) {
    console.log(
      chalk.bgRedBright(
        "Konfigurasi tidak ada harap jalankan 'npm run setup' pada directory ini"
      )
    );
    return process.exit();
  }
  const globalConfig: GLOBAL_CONFIG = JSON.parse(
    fs.readFileSync("./config.json").toString()
  );

  const localConfig: UPLOADER_CONFIGURATION = fs.existsSync(globalConfig.last_config_dir + "/log.json") ? JSON.parse(
    fs.readFileSync(globalConfig.last_config_dir + "/log.json").toString()) : null


  useGlobalConfig(globalConfig);
  useConfig(localConfig);
  return console.log(
    chalk.bgGreen(
      chalk.black("Uploader telah dijalankan dengan config pada folder -> " +
        globalConfig.last_config_dir)
    )
  );
}


export function useConfig(
  config: UPLOADER_CONFIGURATION | null = null,
  flash = false
) {
  localConfig = config ?? localConfig;
  if (flash) localConfig = null;
  return localConfig;
}