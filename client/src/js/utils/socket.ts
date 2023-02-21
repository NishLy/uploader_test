import { io } from "socket.io-client"
import { drawAlert } from "./drawAlert"
const socket = io()

export const onDataRecived = (onrecived: (param: any) => void) => {
    socket.on("data-upload", (data, callback) => {
        if (!data) return drawAlert("tidak terhubung ke server")
        data = JSON.parse(data)
        if (Object.keys(data).length === 0) return
        if (onrecived) onrecived(data)
        if (callback) callback("data received at " + new Date().toTimeString())
        return
    })
    return
}

export const onConfigRecived = (onrecived: (param: any) => void) => {
    socket.on("config", (data, callback) => {
        if (!data) return drawAlert("tidak terhubung ke server")
        data = JSON.parse(data)
        if (Object.keys(data).length === 0) return
        if (onrecived) onrecived(data)
        if (callback) callback("config received at " + new Date().toTimeString())
        return
    })
    return
}