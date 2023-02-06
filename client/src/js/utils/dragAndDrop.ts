declare interface DropZoneInterface {
    targetDiv: HTMLElement | HTMLDivElement
    // inputElemet: HTMLInputElement
    callbackClose?: (param: any) => void
    callbackOndrop: (param: any) => void
    callbackOndragover: (param: any) => void
    callbackLeave?: (param: any) => void
}

export default class DropZone {
    private targetDiv: HTMLElement | HTMLDivElement
    // private inputElemet: HTMLInputElement
    private callbackClose: ((param: any) => void) | undefined
    private callbackOndrop: (param: any) => void
    private callbackOndragover: (param: any) => void
    private callbackLeave: ((param: any) => void) | undefined

    constructor({ targetDiv, callbackOndragover, callbackOndrop, callbackClose, callbackLeave }: DropZoneInterface) {
        this.targetDiv = targetDiv
        // this.inputElemet = inputElemet
        this.callbackOndragover = callbackOndragover
        this.callbackClose = callbackClose
        this.callbackLeave = callbackLeave
        this.callbackOndrop = callbackOndrop

        // console.log(this.callbackOndragover)

        this.targetDiv.addEventListener('dragover', (event) => this.callbackOndragover(event))
        this.targetDiv.addEventListener('drop', (event) => this.callbackOndrop(event))
        if (this.callbackLeave !== undefined) this.targetDiv.addEventListener('dragleave', (event) => { if (this.callbackLeave) this.callbackLeave(event) })
        if (this.callbackClose !== undefined) this.targetDiv.addEventListener('click', (event) => { if (this.callbackClose) this.callbackClose(event) })

    }

    remove() {
        this.targetDiv.removeEventListener('dragover', () => null)
        this.targetDiv.removeEventListener('drop', () => null)
        if (this.callbackLeave !== undefined) this.targetDiv.removeEventListener('dragleave', () => null)
        if (this.callbackClose !== undefined) this.targetDiv.removeEventListener('click', () => null)
    }


}