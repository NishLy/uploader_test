/* Importing all the modules that are needed for the server to run. */
import express from "express";
import routesUpload from "./routes/upload";
import routesAdmin from "./routes/admin";
import bodyParser from "body-parser";
import { DATA_JSON, UPLOADER_CONFIGURATION } from ".";
import listDataMahasiswa from "./lib/mahasiswa";
import { Server } from "socket.io"
import http from "http"
import ipValidation from "./midleware/ip";
import chalk from "chalk";
import figlet from "figlet";
import dotenv from "dotenv"

/* Creating a server and exporting it to be used in other files. */
dotenv.config()
const App = express()
const server = http.createServer(App);
const port = process.env.PORT || 3000
let localConfig: UPLOADER_CONFIGURATION | null = null
export const io = new Server(server)
export const listData = new listDataMahasiswa([]);

/**
 * It sets the globalConfig variable to the config parameter if it's not null, otherwise it sets it to
 * the current value of globalConfig
 * @param {UPLOADER_CONFIGURATION | null} [config=null] - UPLOADER_CONFIGURATION | null = null
 * @returns The globalConfig is being returned.
 */
export function useConfig(config: UPLOADER_CONFIGURATION | null = null) {
  localConfig = config ?? localConfig
  if (config === undefined) config === null
  return localConfig
}

/* It's setting up the routes for the server. */
App.use(express.static('../client/dist'))
App.use(bodyParser.json());
App.use(ipValidation)
App.use('/upload', routesUpload)
App.use('/admin', routesAdmin)

/* It's serving the index.html file from the client/dist folder. */
App.get('/', (_, res) => {
  res.sendFile('index.html', { root: '../client/dist' })
})

/* It's getting the config from the server. */
App.get('/config', (_, res) => {
  if (useConfig()) return res.json(useConfig())
  return res.status(404).end()
})

/* It's listening to the connection event and then it's emitting the data-upload and config events. */
io.on('connection', (socket) => {
  socket.emit('data-upload', JSON.stringify(getData() ?? {}))
  socket.emit('config', JSON.stringify(useConfig()))
});


/**
 * If the config is not set, return null. If it is set, return the data
 * @returns DATA_JSON | null
 */
export const getData = (): DATA_JSON | null => {
  if (!useConfig()) return null
  return {
    last_fetched: Date.now(),
    kelas: useConfig()?.kelas ?? "undefined",
    matkul: useConfig()?.matkul ?? "undefined",
    data: listData.getAll()
  }
}

export default function serve() {
  server.listen({ port, host: '0.0.0.0' }, () => console.log(chalk.green(figlet.textSync("listening on port " + port))),)
}




