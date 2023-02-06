import express, { response } from "express";
// import fileUpload from "express-fileupload"
import routesUpload from "./routes/uploads";
import routesAdmin from "./routes/admin";
import bodyParser from "body-parser";
import { DATA_INTERFACE, DATA_JSON, UPLOADER_CONFIGURATION } from ".";
import ListData from "./utils/dataHandler";
import { Server, Socket } from "socket.io"
import http from "http"

const App = express()
const server = http.createServer(App);
export const io = new Server(server)
const port = process.env.PORT || 3000
// export const fixedPath = `E:\\uploader\\2022`
export const listData = new ListData([]);
let globalConfig: UPLOADER_CONFIGURATION | null = null

export default function useConfig(config: UPLOADER_CONFIGURATION | null = null) {
  globalConfig = config ?? globalConfig
  if (config === undefined) config === null
  return globalConfig
}

// App.use(fileUpload())
App.use(express.static('../client/dist'))
App.use(bodyParser.json());

App.use('/upload', routesUpload)
App.use('/admin', routesAdmin)

App.get('/', (_, res) => {
  res.sendFile('index.html', { root: '../client/dist' })
})

App.get('/config', (_, res) => {
  if (useConfig()) return res.json(useConfig())
  return res.status(404).end()
})

io.on('connection', (socket) => {
  console.log('user connected sending updated upload data');
  emitUpload(socket)
  socket.emit('config', JSON.stringify(useConfig()))
});

export const emitUpload = (socket: Socket) => {
  socket.emit('data-upload', JSON.stringify(getData() ?? {}), (response: Response) => {
    console.log(response)
  })
}

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




