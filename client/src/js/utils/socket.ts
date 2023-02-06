import { io } from "socket.io-client"
import DrawMTableData from "./drawTable"
const socket = io()
export default function creatSocket() {
    return socket
}

export const onDataRecived = (onrecived: (param: any) => void) => {
    socket.on("data-upload", (data, callback) => {
        data = JSON.parse(data)
        if (Object.keys(data).length === 0) return
        if (onrecived) onrecived(data)
        if (callback) callback("data received at " + new Date().toTimeString())
    })
}

export const onConfigRecived = (onrecived: (param: any) => void) => {
    socket.on("config", (data, callback) => {
        if (!data) return
        data = JSON.parse(data)
        if (Object.keys(data).length === 0) return
        if (onrecived) onrecived(data)
        if (callback) callback("config received at " + new Date().toTimeString())
    })
}