import { DATA_JSON, DATA_INTERFACE } from "../..";
import { drawAlert } from "./drawAlert";
import useFetch, { HTTPMethod } from "./useFetch";
let last_draw: number;

export default function DrawMTableData({ last_fetched, data, isLoged = false }: { last_fetched: number, data: DATA_INTERFACE[], isLoged?: boolean }): void {
    const table = document.querySelector('#main-data-table')
    console.log(data)
    table.innerHTML = ""
    table.innerHTML = `<tr><th>No</th><th>NIM</th><th>Nama</th><th>Nama File</th><th>Tanggal</th><th>Aksi</th></tr>`

    if (!last_fetched) return
    if (data.length === 0) return
    if (last_fetched === last_draw) return

    data.forEach((element: DATA_INTERFACE, index) => {
        const tr = document.createElement('tr')
        table.appendChild(drawTr(tr, index, element, isLoged))
    });

}

const drawTr = (tr: HTMLTableRowElement, index: number, element: DATA_INTERFACE, isLoged: boolean = false) => {
    if (index % 2 === 0) tr.className = "bg-blue-500"
    else tr.className = "bg-slate-500"

    let td = document.createElement('td')
    td.innerText = (index + 1).toString() + "."
    tr.appendChild(td)

    td = document.createElement('td')
    td.innerText = element.nim
    tr.appendChild(td)

    td = document.createElement('td')
    td.innerText = element.name
    tr.appendChild(td)

    td = document.createElement('td')
    td.innerText = element.file_name
    tr.appendChild(td)

    td = document.createElement('td')
    td.innerText = new Date(element.date).toLocaleString()
    tr.appendChild(td)


    td = document.createElement('td')
    if (isLoged) {
        td.innerHTML = "<button class='bg-red-500 px-2 py-1 rounded-md'>Hapus</button> "
        td.addEventListener('click', () => {
            if (!confirm("Hapus data milik " + element.nim + " ?")) return
            useFetch({ url: '/upload/', method: HTTPMethod.delete, body: JSON.stringify({ nim: element.nim }) }, { oncomplete: () => drawAlert("Data milik " + element.nim + " terhapus") })
        })
    }
    tr.appendChild(td)
    return tr
}