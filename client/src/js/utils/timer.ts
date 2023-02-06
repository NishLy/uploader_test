export default class Timer {
    private current: Date | null = null
    private intervalDate: any
    private endTimer: Date
    private drawTarget: HTMLElement | null = null

    constructor(date: Date, target: HTMLElement | null = null) {
        this.endTimer = date
        this.drawTarget = target
        this.intervalDate = setInterval(() => this.update(), 1000)
    }

    update() {
        this.current = new Date()
        const hour = this.endTimer.getHours() - this.current.getHours()
        const minutes = this.endTimer.getMinutes() - this.current.getMinutes() < 0 ?
            (60 - (this.current.getMinutes()) + this.endTimer.getMinutes()) : this.endTimer.getMinutes() - this.current.getMinutes()


        if (this.drawTarget) this.drawTarget.innerHTML = `
        <td>${hour}</td>
        <td>:</td>
        <td>${(minutes < 10 ? '0' + minutes : minutes)}</td>
        <td>:</td>
        <td>${60 - this.current.getSeconds() < 10 ? ('0' + (60 - this.current.getSeconds())) : 60 - this.current.getSeconds()}</td>
        `
        if (this.endTimer.getTime() - this.current.getTime() <= 0) {
            this.remove()
            if (this.drawTarget) this.drawTarget.innerHTML = `<td colspan="5" class="bg-red-700 rounded-md">Waktu Habis</td>`
            return
        }

    }

    pause() {
        clearInterval(this.intervalDate)
    }

    resume() {
        this.intervalDate = setInterval(() => this.update(), 1000)
    }

    remove() {
        clearInterval(this.intervalDate)
    }


}


