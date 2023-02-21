
import { UPLOADER_CONFIGURATION } from "../.."
import { drawAlert } from "./drawAlert"

declare interface FileInputInterfaces {
    // checkFile: ((param: any) => void)
    onvalidCallback: ((param?: any) => void)
    onclearCallback: ((param?: any) => void)
    requirements: UPLOADER_CONFIGURATION
    inputElement: HTMLInputElement
}

export default class FileInput {
    // private checkFile: ((param: any) => void)
    private onvalidCallback: ((param: File) => void)
    private onclearCallback: (() => void)
    private inputElement: HTMLInputElement
    private requirments: UPLOADER_CONFIGURATION

    constructor({ inputElement, requirements, onvalidCallback, onclearCallback }: FileInputInterfaces) {
        this.inputElement = inputElement,
            this.onvalidCallback = onvalidCallback,
            this.onclearCallback = onclearCallback,
            this.requirments = requirements
    }

    fileValidition() {
        if (this.inputElement.files?.length === 0) return drawAlert("Belum ada file!", 2)
        if (this.requirments.file_types.length === 0) return drawAlert("Belum Konfigurasi File Requirments!", 2)

        if (-1 === this.requirments.file_types.indexOf(this.inputElement.files![0].type)) return drawAlert(`Format File Tidak Didukung ${this.inputElement.files![0].type}`, 2)
        console.log(this.requirments.max_size, this.inputElement.files![0].size)
        if (this.requirments.max_size < this.inputElement.files![0].size) return drawAlert("Ukuran File Terlalu Besar > " + this.requirments.max_size / 1000000 + "MB", 2)

        return this.onvalidCallback(this.inputElement.files![0])

    }

    resetInput() {
        this.onclearCallback()
    }
}