/* Importing all the modules that are needed for the server to run. */
import express from "express";
import routesUpload from "./routes/uploads";
import routesAdmin from "./routes/admin";
import bodyParser from "body-parser";
import { DATA_JSON, UPLOADER_CONFIGURATION } from ".";
import ListData from "./utils/dataHandler";
import { Server } from "socket.io"
import http from "http"
import ipValidation from "./midleware/ip";

/* Creating a server and exporting it to be used in other files. */
const App = express()
const server = http.createServer(App);
export const io = new Server(server)
const port = process.env.PORT || 3000
export const listData = new ListData([]);
let globalConfig: UPLOADER_CONFIGURATION | null = null

/**
 * It sets the globalConfig variable to the config parameter if it's not null, otherwise it sets it to
 * the current value of globalConfig
 * @param {UPLOADER_CONFIGURATION | null} [config=null] - UPLOADER_CONFIGURATION | null = null
 * @returns The globalConfig is being returned.
 */
export default function useConfig(config: UPLOADER_CONFIGURATION | null = null) {
  globalConfig = config ?? globalConfig
  if (config === undefined) config === null
  return globalConfig
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

server.listen({ port, host: '0.0.0.0' }, () => console.log("listening to port " + port),)




