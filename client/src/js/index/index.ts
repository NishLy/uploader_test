import Timer from "../utils/timer";
import "../../css/index.css"
import { drawAlert } from "../utils/drawAlert";
import DropZone from "../utils/dragAndDrop";
import FileInput from "../utils/htmlFileInput";
import DrawMTableData from "../utils/drawTable";
import { DATA_INTERFACE, UPLOADER_CONFIGURATION } from "../..";
import useFetch, { HTTPMethod } from "../utils/useFetch";
import drawTitle from "../utils/drawTitle";
import initializeTimer from "../utils/drawTimer";
import { onConfigRecived, onDataRecived } from "../utils/socket";

///////////////////////////////////////////////////////////////
//  Global Variable
//////////////////////////////////////////////////////////////
let config: UPLOADER_CONFIGURATION | null = null

///////////////////////////////////////////////////////////////
// utils Functions
//////////////////////////////////////////////////////////////

const toggleModal = (event: Event | null = null) => {
    if (event) event.preventDefault()
    document.querySelector('#drop-zone')?.classList.remove('drag')
    document.querySelector('#modal-area')?.classList.toggle('hidden')
}

///////////////////////////////////////////////////////////////
// File Management Functions
//////////////////////////////////////////////////////////////

let fileInputObject: FileInput
let timer: Timer | null = null

///////////////////////////////////////////////////////////////
// DropZone Functions
//////////////////////////////////////////////////////////////

const dropHandler = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer!.files) {
        if (e.dataTransfer?.files.length !== 1) return drawAlert("Hanya bisa menerima 1 file!!")
        const inputContainer: HTMLInputElement | null = document.querySelector('#fileInput')
        if (inputContainer) {
            inputContainer.files = e.dataTransfer.files
            fileInputObject.fileValidition()
        }
    }
}

const dragOverHandler = (e: DragEvent) => {
    e.preventDefault()
    const drop_zone = document.querySelector('#drop-zone')
    drop_zone?.classList.add('drag')
}

function dragLeave(e: DragEvent) {
    const element = e.currentTarget as HTMLElement
    element.classList.remove('drag')
}

const mountFileListener = () => {
    fileInputObject = new FileInput({
        inputElement: document.querySelector('#fileInput'),
        onvalidCallback: (file: File) => { document.querySelector('#invoke-modal').innerHTML = `<marquee behavior="" direction="right">${file.name}</marquee>`; toggleModal() },
        onclearCallback: () => { document.querySelector('#invoke-modal').innerHTML = "Pilih File" },
        requirements: config
    })
}

///////////////////////////////////////////////////////////////
// EvenListener Section
//////////////////////////////////////////////////////////////

function mountEventListener() {
    //click ToggleModal
    document.querySelector('#modal-area')?.addEventListener('click', (event) => {
        event.stopPropagation()
        toggleModal(event)
    })
    document.querySelector('#invoke-modal')?.addEventListener('click', (event) => !config ? drawAlert("Konfigurasi Belum valid, tidak bisa memilih file!") : toggleModal(event))
    document.querySelector('#chose-file-btn')?.addEventListener('click', (event: Event) => {
        event.stopPropagation()
        const fileInput: HTMLInputElement | null = document.querySelector("#fileInput") as HTMLInputElement
        fileInput?.click();
    });
    document.querySelector('#form-main')?.addEventListener("submit", (event: Event) => {
        event.preventDefault();
        if (!config) return drawAlert("Konfigurasi Belum valid!")
        const formData = new FormData(event.target as HTMLFormElement)
        useFetch({ url: "/upload", body: formData, method: HTTPMethod.post, type: "multipart/form-data" }, {
            oncomplete: () => {
                drawAlert("berhasil upload", 1);
                (event.target as HTMLFormElement).reset();
                document.querySelector('#invoke-modal').innerHTML = "Pilih File"
            },
            onfail: () => {
                drawAlert("gagal upload");
                (event.target as HTMLFormElement).reset();
                document.querySelector('#invoke-modal').innerHTML = "Pilih File"
            }
        })
    });
    document.querySelector('#reset-btn')?.addEventListener('click', (event) => {
        event.preventDefault();
        (document.querySelector('#form-main') as HTMLFormElement)?.reset()
        fileInputObject.resetInput()
    })
    document.querySelector('#fileInput')?.addEventListener('change', () => fileInputObject.fileValidition())
    document.querySelector('#form-main')?.addEventListener('submit', () => {
        if (new Date(config.end).getTime() - new Date().getTime() <= 0) return drawAlert("Waktu Telah Habis!. Upload Gagal")
    })
}


const renderSelectForm = (): void => {
    const form = document.querySelector('#form-main')
    if (config?.choiches && config.choiches.length !== 0) {
        const select = document.createElement('select')
        const label = document.createElement('label')
        select.name = "kode_soal"
        select.title = "Pilih Kode Soal"
        select.className = "bg-transparent "
        label.htmlFor = "choices"
        label.innerText = "Jenis Soal"
        form?.appendChild(label)
        select.innerHTML = ` ${config.choiches?.map(data => `<option class="uppercase bg-black" value="${data}">${data}</option>`)}`
        select.classList.add("input-form")
        form?.appendChild(select)
    }
}

///////////////////////////////////////////////////////////////
// Onload Section
//////////////////////////////////////////////////////////////

window.onload = () => {
    onDataRecived((data) => DrawMTableData(data))
    new DropZone({
        targetDiv: document.querySelector('#drop-zone') as HTMLDivElement,
        callbackOndrop: dropHandler,
        callbackOndragover: dragOverHandler,
        callbackLeave: dragLeave,
    })
    onConfigRecived(data => {
        config = data
        drawTitle(config?.matkul, config?.kelas);
        if (timer) timer.remove();
        timer = initializeTimer(config?.end);
        drawAlert("Konfigurasi terupdate", 1);
        renderSelectForm()
        mountEventListener()
        mountFileListener()
    })
    drawTitle(config?.matkul, config?.kelas);
    setTimeout(() => {
        if(!config){
            drawAlert("Gagal Fetching data Konfigurasi,harap refresh halaman");
            window.location.reload()
        }
    }, 5000)
}


