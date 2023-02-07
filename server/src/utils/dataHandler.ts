import { DATA_INTERFACE } from "..";

class ListData {
    private data: DATA_INTERFACE[];
    constructor(data: DATA_INTERFACE[]) {
        this.data = data
    }
    removeAll() {
        this.data = [];
    }
    remove(nim: string) {
        this.data = this.data.filter((data) => data.nim !== nim)
    }
    append(data: DATA_INTERFACE) {
        console.log(data)
        this.data.push(data)
    }
    update(nim: string, data: DATA_INTERFACE) {
        const index = this.data.findIndex((data) => data.nim !== nim)
        if (index !== -1) this.data[index] = data
    }
    get(nim: string) {
        return this.data.find((data) => data.nim === nim) 
    }
    getAll() {
        return this.data
    }
    setAll(data: DATA_INTERFACE[]) {
        this.data = data
    }
}

export default ListData