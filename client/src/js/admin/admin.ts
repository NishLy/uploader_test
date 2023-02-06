import "../../css/index.css"
import "../../css/admin.css"
import useFetch, { HTTPMethod } from "../utils/useFetch"
import { drawAlert } from "../utils/drawAlert"
import { DATA_JSON } from "../.."
import { UPLOADER_CONFIGURATION } from "../.."
import Timer from "../utils/timer"
import drawTitle from "../utils/drawTitle"
import initializeTimer from "../utils/drawTimer"
import creatSocket, { onConfigRecived, onDataRecived } from "../utils/socket"
import DrawMTableData from "../utils/drawTable"

const rootElements = document.querySelector('#component-wrapper')
let config: UPLOADER_CONFIGURATION | null = null
let timer: Timer;
// const Data_Snapshot: DATA_JSON | null = null

window.onload = () => {
    creatSocket()
    onDataRecived((data) => DrawMTableData(data))
    onConfigRecived(data => {
        config = data
        drawTitle(config?.matkul, config?.kelas);
        if (timer) timer.remove();
        timer = initializeTimer(config?.end);
        drawAlert("Konfigurasi terupdate", 1);
        rootElements.innerHTML = TemplateConfig()
    })
    // fetchConfig(() => );
     getAccesToken() === "" ? renderLogin() : renderConfig()
    // drawDataTable({ last_fetched: Data_Snapshot?.last_fetched, data: Data_Snapshot?.data, isLoged: true })
}

const renderLogin = (): void => {
    rootElements.innerHTML = TemplateLogin()
}

const renderConfig = (): void => {
    rootElements.innerHTML = TemplateConfig()
}

// function fetchConfig(oncomplete?: () => void): void {
//     useFetch({ url: "/config", method: HTTPMethod.get }, {
//         oncomplete: (data) => config = data,
//         onfinal: () => {
//             drawTitle(config?.matkul, config?.kelas);
//             if (timer) timer.remove();
//             timer = initializeTimer(config?.end);
//             drawAlert("Konfigurasi terupdate", 1);
//             (oncomplete) && oncomplete()
//         }
//     })
// }



function getAccesToken(): string | undefined {
    return document.cookie.split("; ").find((row) => row.startsWith('access-token='))?.split('=')[1] ?? ""
}

const logout = () => {
    document.cookie = `access-token=; expires=${new Date().toUTCString()}; path=/admin;`;
    renderLogin();
}

function TemplateConfig(): string {
    setTimeout(() => {
        document.querySelector('#form-main').addEventListener('submit', (e) => {
            e.stopPropagation()
            e.preventDefault()

            const target = (e.currentTarget as HTMLFormElement)
            const formData = new FormData(target)
            const dateEnd = new Date()
            const [hours, minutes] = formData.get('waktu').toString().split(":")
            dateEnd.setSeconds(0)
            dateEnd.setHours(parseInt(hours))
            dateEnd.setMinutes(parseInt(minutes))

            if (dateEnd.getTime() - new Date().getTime() <= 0) return drawAlert('PENGATURAN JAM SELESAI TIDAK VALID')
            const data: UPLOADER_CONFIGURATION = {
                dir: `${formData.get('path')}`,
                matkul: `${formData.get('matkul')}`,
                uploader_name: `${formData.get('name')}`,
                kelas: `${formData.get('kelas')}`,
                format_name: parseInt(`${formData.get('name_format')}`),
                file_types: ['image/png'],
                end: dateEnd.getTime(),
                choiches: [],
                max_size: 1000000
            }

            useFetch({
                url: 'admin/config',
                method: HTTPMethod.post,
                body: JSON.stringify(data),
                token: "Bearer " + getAccesToken()
            },
                {

                    // oncomplete: () => fetchConfig(() => rootElements.innerHTML = TemplateConfig()),
                    oncomplete: () => null,
                    onabbort: () => drawAlert("Gagal Upload Konfigurasi", 3),
                    onfail: () => {
                        drawAlert("Token tidak valid", 3);
                        logout();
                    }
                })
        })
        document.querySelector("#logout-button").addEventListener("click", logout)
    }, 100)

    const isConfig = config ? true : false;
    const hours = isConfig && new Date(config.end).getHours()
    const minutes = isConfig && new Date(config.end).getMinutes()

    return `
    <form id="form-main" class="flex flex-col">
    <label for="config_name">Uploader Name</label>
    <input required type="text" name="name" value="${isConfig ? config.uploader_name : ""}">
    <label for="path">Path</label>
    <input required type="text" name="path" value="${isConfig ? config.dir : ""}">
    <label for="matkul">Mata Kuliah</label>
    <input required type="text" name="matkul" value="${isConfig ? config.matkul : ""}">
    <label for="kelas">Kelas</label>
    <input required type="text" name="kelas" value="${isConfig ? config.kelas : ""}">
    <label for="waktu">Waktu</label>
    <input required type="time" name="waktu" value="${isConfig ? hours + ":" + (minutes < 10 ? '0' + minutes : minutes) : ""}">
    <label for="name_format">Format Nama</label>
    <select name="name_format" id="" class="text-xs mb-4 rounded-md px-2 p-2">
      <option ${isConfig && (config.format_name === 1) ? "selected" : null} value="1">NIM_KELAS_MATKUL</option>
      <option ${isConfig && (config.format_name === 2) ? "selected" : null} value="2">NIM_KELAS_MATKUL_TYPE</option>
      <option ${isConfig && (config.format_name === 3) ? "selected" : null} value="3">NO-PC_NIM_KELAS_MATKUL_TYPE</option>
    </select>
    <button type="submit" class="btn-primary">SUBMIT</button>
  </form> 
  <button id="logout-button" class="btn-danger absolute bottom-4 right-4">Log Out</button>
  `
}

function TemplateLogin(isMounted = false): string {
    setTimeout(() => document.querySelector('#form-main').addEventListener('submit', (e: Event) => {
        e.preventDefault()
        const target = e.currentTarget as HTMLFormElement
        const formData = new FormData(target)
        const data = {
            username: formData.get('username'),
            password: formData.get('password'),
        }
        useFetch({
            url: 'admin/login',
            method: HTTPMethod.post,
            body: JSON.stringify(data)
        }, {
            oncomplete: (data) => {
                rootElements.innerHTML = TemplateConfig();
                drawAlert("Berhasil Login", 1);
                document.cookie = "access-token=" + data.token + "; " + "expires=" + new Date(data.expires).toUTCString() + "; path=/admin;";
            },
            onabbort: () => drawAlert("Gagal Login"),
            onfail: () => drawAlert("username atau password salah!")
        })
    }), 1000)


    return `
    <form id="form-main" class="flex flex-col">
        <label for="username">Username</label>
        <input type="text" name="username">
        <label for="password">Password</label>
        <input type="password" name="password" class="mb-5">
        <button type="submit" class="btn-primary">Login</button>
    </form>
    `
}