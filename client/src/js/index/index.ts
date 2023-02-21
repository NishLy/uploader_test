/* Importing all the modules that are needed for the project. */
import Timer from "../utils/timer";
import "../../css/index.css"
import { drawAlert } from "../utils/drawAlert";
import DropZone from "../utils/dragAndDrop";
import FileInput from "../utils/htmlFileInput";
import DrawMTableData from "../utils/drawTable";
import { UPLOADER_CONFIGURATION } from "../..";
// import useFetch, { HTTP } from "../lib/useFetch";
import drawTitle from "../utils/drawTitle";
import initializeTimer from "../utils/drawTimer";
import { onConfigRecived, onDataRecived } from "../utils/socket";
import xhrRequest, { HTTP, xhrRequestError } from "../lib/xhrrequest";

/* A variable that is used to store the configuration of the uploader. */
let config: UPLOADER_CONFIGURATION | null = null

/**
 * If the event is not null, prevent the default action, then remove the class 'drag' from the element
 * with the id 'drop-zone', then toggle the class 'hidden' on the element with the id 'modal-area'.
 * @param {Event | null} [event=null] - Event | null = null
 */
const toggleModal = (event: Event | null = null) => {
    if (event) event.preventDefault()
    document.querySelector('#drop-zone')?.classList.remove('drag')
    document.querySelector('#modal-area')?.classList.toggle('hidden')
}

let fileInputObject: FileInput
let timer: Timer | null = null


window.onload = () => {
    /* A function that is called when the data is received. */
    onDataRecived((data) => DrawMTableData(data))
    /* Creating a new DropZone object. */
    new DropZone({
        targetDiv: document.querySelector('#drop-zone') as HTMLDivElement,
        callbackOndrop: dropHandler,
        callbackOndragover: dragOverHandler,
        callbackLeave: dragLeave,
    })

    /* A function that is called when the configuration is received. */
    onConfigRecived(data => {
        if (!data) return
        config = data
        drawTitle(config?.matkul, config?.kelas);
        if (timer) timer.remove();
        timer = initializeTimer(config!.end);
        drawAlert("Konfigurasi terupdate", 1);
        mountFileListener();
        renderSelectForm();
    })

    /* Rendering the select form, mounting the event listener, mounting the file listener, and drawing
    the title. */

    mountEventListener()
    drawTitle(config?.matkul, config?.kelas);


    /* Checking if the config is not null, if it is null, it will draw an alert and reload the page. */
    setTimeout(() => {
        if (!config) {
            drawAlert("Gagal Fetching data Konfigurasi,harap refresh halaman", 3);
            window.location.reload()
        }
    }, 5000)
}

/**
 * If the event has files, and the number of files is not 1, then draw an alert, otherwise, if the
 * input container exists, set the files to the input container's files, and then call the
 * fileValidition function on the fileInputObject.
 * @param {DragEvent} e - DragEvent - The event object that is passed to the event handler.
 * @returns The return value is the result of the last expression evaluated in the function.
 */
const dropHandler = (e: DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer!.files) {
        if (e.dataTransfer?.files.length !== 1) return drawAlert("Hanya bisa menerima 1 file!!", 2)
        const inputContainer: HTMLInputElement | null = document.querySelector('#fileInput')
        if (inputContainer) {
            inputContainer.files = e.dataTransfer.files
            fileInputObject.fileValidition()
        }
    }
    return
}

/**
 * If the drop_zone element exists, add the class 'drag' to it.
 * @param {DragEvent} e - DragEvent - The event object that is passed to the handler.
 */
const dragOverHandler = (e: DragEvent) => {
    e.preventDefault()
    const drop_zone = document.querySelector('#drop-zone')
    drop_zone?.classList.add('drag')
}

/**
 * `dragLeave` removes the `drag` class from the element that the user is dragging over
 * @param {DragEvent} e - DragEvent - The event object that is passed to the event handler.
 */
function dragLeave(e: DragEvent) {
    const element = e.currentTarget as HTMLElement
    element.classList.remove('drag')
}

/**
 * When the user clicks the file input, the file input object will be created and the file input will
 * be validated based on the requirements in the config object.
 */
const mountFileListener = () => {
    fileInputObject = new FileInput({
        inputElement: document.querySelector('#fileInput')!,
        onvalidCallback: (file: File) => { document.querySelector('#invoke-modal')!.innerHTML = `<marquee behavior="" direction="right">${file.name}</marquee>`; toggleModal() },
        onclearCallback: () => { document.querySelector('#invoke-modal')!.innerHTML = "Pilih File" },
        requirements: config!
    })
}

/**
 * This function is used to mount event listener to the DOM
 */
function mountEventListener() {
    //click ToggleModal
    document.querySelector('#modal-area')?.addEventListener('click', (event) => {
        event.stopPropagation()
        toggleModal(event)
    })
    document.querySelector('#invoke-modal')?.addEventListener('click', (event) => !config ? drawAlert("Konfigurasi Belum valid, tidak bisa memilih file!", 2) : toggleModal(event))
    document.querySelector('#chose-file-btn')?.addEventListener('click', (event: Event) => {
        event.stopPropagation()
        const fileInput: HTMLInputElement | null = document.querySelector("#fileInput") as HTMLInputElement
        fileInput?.click();
    });
    document.querySelector('#form-main')?.addEventListener("submit", async (event: Event) => {
        
        event.preventDefault();
        if (!config) return drawAlert("Konfigurasi Belum valid!", 2)
        if (new Date(config.end).getTime() - new Date().getTime() <= 0) return drawAlert("Waktu Telah Habis!. Upload Gagal", 3)
        const formData = new FormData(event.target as HTMLFormElement)

        const unmountUploadBar = drawAlert("", -1, false,
            `<div class="progress relative w-full h-full rounded-md">
            <div id="upload-progress-bar" class="bar"></div>
            <span id="upload-detail-text" class="absolute left-10 top-2"></span>
            </div>
            <button class="ml-2 btn-danger" id="cancel-upload-btn">Batalkan</button> `
        )

        function abortUpload(xhr: XMLHttpRequest) {
            document.querySelector('#cancel-upload-btn')?.addEventListener('click', () => {
                xhr.abort()
                unmountUploadBar && unmountUploadBar();
            })
        }

        await xhrRequest({ url: "/upload", method: HTTP.post, body: formData, abortOn: abortUpload }, {
            onProgress: (event) => {
                (document.querySelector("#upload-progress-bar") as HTMLDivElement).style.width = `${(event.loaded / event.total) * 100}%`;
                (document.querySelector("#upload-detail-text") as HTMLSpanElement).innerText = `${(event.loaded / 1000000).toFixed(2)} Mb / ${(event.total / 1000000).toFixed(2)} Mb`
            }
        })
            .then(data => {
                if (data.type === "json") {
                    const resJSON = JSON.parse(data.res.toString());
                    drawAlert(resJSON.message, 1);
                    unmountUploadBar && unmountUploadBar();
                    (event.target as HTMLFormElement).reset();
                    document.querySelector('#invoke-modal')!.innerHTML = "Pilih File"
                }
            })
            .catch((error: xhrRequestError) => {
                unmountUploadBar && unmountUploadBar();
                const resJSON = JSON.parse(error.message as string)
                drawAlert(resJSON.message, 3);
            })
        return
    });

    document.querySelector('#reset-btn')?.addEventListener('click', (event) => {
        event.preventDefault();
        (document.querySelector('#form-main') as HTMLFormElement)?.reset()
        fileInputObject.resetInput()
    })

    document.querySelector('#fileInput')?.addEventListener('change', () => fileInputObject.fileValidition())
}


/**
 * If the config object has a property called choiches, and that property has a length greater than
 * zero, then create a select element, add a label, add the options, and append the select element to
 * the form.
 */
const renderSelectForm = (): void => {
    const form = document.querySelector('#form-main')
    if (config?.choiches && config.choiches.length !== 0) {
        const select = document.createElement('select')
        const label = document.createElement('label')
        const selectOld = document.getElementsByName('kode_soal')[0]
        select.name = "kode_soal"
        select.title = "Pilih Kode Soal"
        select.className = "bg-transparent p-2"
        label.htmlFor = "choices"
        label.innerText = "Jenis Soal"

        select.innerHTML = ` ${config.choiches?.map(data => `<option class="uppercase bg-black" value="${data}">${data}</option>`)}`
        select.classList.add("input-form")
        if (!selectOld) {
            form?.appendChild(label)
            form?.appendChild(select)
        }
    }
}

