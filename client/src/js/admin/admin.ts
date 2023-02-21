/* It's importing the css files and the other files. */
import "../../css/index.css"
import "../../css/admin.css"
import useFetch, { HTTP } from "../lib/useFetch"
import { drawAlert } from "../utils/drawAlert"
import { UPLOADER_CONFIGURATION } from "../.."
import Timer from "../utils/timer"
import drawTitle from "../utils/drawTitle"
import initializeTimer from "../utils/drawTimer"
import { onConfigRecived, onDataRecived } from "../utils/socket"
import DrawMTableData from "../utils/drawTable"

/* Declaring a variable. */
const rootElements = document.querySelector('#component-wrapper')
let config: UPLOADER_CONFIGURATION | null = null
let timer: Timer;

/* A function that is called when the window is loaded. */
window.onload = () => {
    onDataRecived((data) => DrawMTableData({ ...data, isLoged: getAccesToken() !== "" ? true : false }))
    onConfigRecived(data => {
        if (!data) return
        config = data
        getAccesToken() === "" ? renderLogin() : renderConfig()
        drawTitle(config?.matkul, config?.kelas);
        if (timer) timer.remove();
        timer = initializeTimer(config!.end);
        drawAlert("Konfigurasi terupdate", 1);
        if (!config) rootElements!.innerHTML = TemplateConfig()
    })

    /* It's checking if the config is null or not. If it's null, it will call the function `useFetch`
        and if it's not null, it will do nothing. */
    drawTitle(config?.matkul, config?.kelas);
    getAccesToken() === "" ? renderLogin() : renderConfig()
    /* It's checking if the config is null or not. If it's null, it will call the function `useFetch`
    and if it's not null, it will do nothing. */
    setTimeout(() => {
        if (!config) {
            drawAlert("Gagal Fetching data Konfigurasi, Cheking Konfigurasi diserver", 2)
            useFetch({ url: "/config", method: HTTP.get }, { onCompleted: () => window.location.reload(), onfail: () => drawAlert("Konfigurasi Belum dibuat!") })
        }
    }, 2000)
}

/**
 * The renderLogin function is a void function that takes no parameters and sets the innerHTML of the
 * rootElements variable to the TemplateLogin function.
 */
const renderLogin = (): void => {
    rootElements!.innerHTML = TemplateLogin()
}

/**
 * The function renderConfig() is a function that takes no parameters and returns nothing. It sets the
 * innerHTML of the rootElements variable to the result of the TemplateConfig() function.
 */
const renderConfig = (): void => {
    rootElements!.innerHTML = TemplateConfig()
}

/**
 * It returns the value of the cookie named `access-token` if it exists, otherwise it returns an empty
 * string
 * @returns The access token from the cookie.
 */
function getAccesToken(): string | undefined {
    return document.cookie.split("; ").find((row) => row.startsWith('access-token='))?.split('=')[1] ?? ""
}

/**
 * It sets the cookie to an empty string, and then expires it immediately
 */
const logout = () => {
    document.cookie = `access-token=; expires=${new Date().toUTCString()}; path=/admin;`;
    renderLogin();
}

/**
 * The function TemplateConfig() returns a string that contains a form with some inputs and a button,
 * and a button with the id logout-button.
 * @returns A string.
 */
function TemplateConfig(): string {
    setTimeout(() => {
        document.querySelector('#form-main')!.addEventListener('submit', (e) => {
            e.stopPropagation()
            e.preventDefault()

            /* It's getting the value of the input with the name `waktu` and then it's splitting it into
            an array of strings. */
            const target = (e.currentTarget as HTMLFormElement)
            const formData = new FormData(target)
            const dateEnd = new Date()
            const [hours, minutes] = formData.get('waktu')!.toString().split(":") ?? [new Date().getHours(), new Date().getMinutes()]
            dateEnd.setSeconds(0)
            dateEnd.setHours(parseInt(hours))
            dateEnd.setMinutes(parseInt(minutes))

            /* It's checking if the dateEnd is less than or equal to the current date. If it is, it will
            call the function drawAlert and pass it the string 'PENGATURAN JAM SELESAI TIDAK VALID'. */
            if (dateEnd.getTime() - new Date().getTime() <= 0) return drawAlert('PENGATURAN JAM SELESAI TIDAK VALID')

            const data: UPLOADER_CONFIGURATION = {
                dir: `${formData.get('dir')}`,
                matkul: `${formData.get('matkul')}`,
                uploader_name: `${formData.get('uploader_name')}`,
                kelas: `${formData.get('kelas')}`,
                format_name: parseInt(`${formData.get('name_format')}`),
                file_types: formData.get('file_types')!.toString().split(","),
                end: dateEnd.getTime(),
                choiches: parseInt(`${formData.get('name_format')}`) !== 1 ? ["A", "B"] : [],
                max_size: parseInt(formData.get('max_size')!.toString()) * 1000000,
            }

            /* It's calling the function useFetch and passing it an object with the properties url, method, body,
            and token. */

            useFetch(
                {
                    url: 'admin/config',
                    method: HTTP.post,
                    body: JSON.stringify(data),
                    token: getAccesToken()
                },
                {
                    onabbort: () => drawAlert("Gagal Upload Konfigurasi", 3),
                    onfail: () => {
                        drawAlert("Token tidak valid", 3);
                        console.log("Adsd")
                        logout();
                    }
                })
            return
        })
        document.querySelector("#logout-button")!.addEventListener("click", logout)
    }, 100)

    /* It's checking if the config is null or not. If it's null, it will call the function `useFetch`
    and if it's not null, it will do nothing. */
    const isConfig = config ? true : false;
    const hours = isConfig && new Date(config!.end).getHours()
    const minutes = isConfig && new Date(config!.end).getMinutes()

    return `
    <form id="form-main" class="grid grid-flow-row">
    <label for="uploader_name">Uploader Name</label>
    <input required type="text" name="uploader_name" value="${isConfig ? config!.uploader_name : ""}">
    <label for="dir">Path</label>
    <input required type="text" name="dir" value="${isConfig ? config!.dir : ""}">
    <label for="matkul">Mata Kuliah</label>
    <input required type="text" name="matkul" value="${isConfig ? config!.matkul : ""}">
    <label for="kelas">Kelas</label>
    <input required type="text" name="kelas" value="${isConfig ? config!.kelas : ""}">
    <label for="waktu">Waktu</label>
    <input required type="time" name="waktu" value="${isConfig ? (hours < 10 ? '0' + hours : hours) + ":" + (minutes < 10 ? '0' + minutes : minutes) : ""}">
    <label for="max_size">Maksimal Ukuran File(MB)</label>
    <input required type="number" name="max_size" value="${isConfig ? (config!.max_size / 1000000).toString() : ""}">
    <label for="file_types">Format File yang didukung(coma separated)</label>
    <input required type="text" name="file_types" value="${isConfig ? config?.file_types.join(",") : ""}">
    <label for="name_format">Format Nama</label>
    <select name="name_format" id="" class="text-xs mb-4 rounded-md p-2">
      <option ${isConfig && (config!.format_name === 1) ? "selected" : null} value="1">NIM_KELAS_MATKUL</option>
      <option ${isConfig && (config!.format_name === 2) ? "selected" : null} value="2">NIM_KELAS_MATKUL_TYPE</option>
      <option ${isConfig && (config!.format_name === 3) ? "selected" : null} value="3">NO-PC_NIM_KELAS_MATKUL_TYPE</option>
    </select>
    <button type="submit" class="btn-primary">SUBMIT</button>
  </form> 
  <button id="logout-button" class="btn-danger absolute bottom-4 right-4">Log Out</button>
  `
}

function TemplateLogin(): string {
    setTimeout(() => document.querySelector('#form-main')!.addEventListener('submit', (e: Event) => {
        e.preventDefault()
        const target = e.currentTarget as HTMLFormElement
        const formData = new FormData(target)
        const data = {
            username: formData.get('username'),
            password: formData.get('password'),
        }
        useFetch({
            url: 'admin/login',
            method: HTTP.post,
            body: JSON.stringify(data)
        }, {
            onCompleted: (data: any) => {
                rootElements!.innerHTML = TemplateConfig();
                drawAlert("Berhasil Login", 1);
                document.cookie = "access-token=" + data.token + "; " + "expires=" + new Date(data.expires).toUTCString() + "; path=/admin;";
            },
            onabbort: () => drawAlert("Gagal Login"),
            onfail: () => drawAlert("username atau password salah!")
        })
    }), 1000)


    return `
    <form id="form-main" class="grid gap-y-1 grid-flow-row">
        <label for="username">Username</label>
        <input type="text" name="username">
        <label for="password">Password</label>
        <input type="password" name="password" class="mb-5">
        <button type="submit" class="btn-primary">Login</button>
    </form>
    `
}