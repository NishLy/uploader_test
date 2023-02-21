import { DATA_INTERFACE } from "../..";
import { drawAlert } from "./drawAlert";
import { HTTP } from "../lib/useFetch";
import xhrRequest from "../lib/xhrrequest";

let last_draw: number;

/**
 * It will draw a table with the data from the server
 * @param  - last_fetched is the time when the data was fetched from the server
 * @returns Nothing.
 */
export default function DrawMTableData({ last_fetched, data, isLoged = false }: { last_fetched: number, data: DATA_INTERFACE[], isLoged?: boolean }): void {
    const table = document.querySelector('#main-data-table')

    table!.innerHTML = ""
    table!.innerHTML = `<tr><th>No</th><th>NIM</th><th>Nama</th><th>Nama File</th><th>Tanggal</th><th>Aksi</th></tr>`

    if (!last_fetched) return
    if (data.length === 0) return
    if (last_fetched === last_draw) return

    data.forEach((element: DATA_INTERFACE, index) => {
        const tr = document.createElement('tr')
        table!.appendChild(drawTr(tr, index, element, isLoged))
    });

}

/**
 * It takes a table row element, an index, an element, and a boolean, and returns a table row element.
 * 
 * The function is called with the following arguments:
 * 
 *     drawTr(tr, index, element, isLoged)
 * 
 * The first argument is a table row element, the second is a number, the third is an object, and the
 * fourth is a boolean.
 * 
 * The function returns a table row element.
 * 
 * The function is called with the following arguments:
 * 
 *     drawTr(tr, index, element, isLoged)
 * 
 * The first argument is a table row element, the second is a number, the third is an object, and the
 * fourth is a boolean.
 * 
 * The function returns a table row element.
 * 
 * The function is called with the following arguments:
 * 
 *     drawTr(
 * @param {HTMLTableRowElement} tr - HTMLTableRowElement, index: number, element: DATA_INTERFACE,
 * isLoged: boolean = false
 * @param {number} index - The index of the current element being processed in the array.
 * @param {DATA_INTERFACE} element - DATA_INTERFACE
 * @param {boolean} [isLoged=false] - boolean = false
 * @returns A function that takes 3 parameters and returns a tr element.
 */
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
            xhrRequest({
                url: '/upload/', method: HTTP.delete, body: JSON.stringify({ nim: element.nim }),
                headers: [{ name: "Content-Type", value: "application/json" }]
            })
            .then(_data=>  drawAlert("berhasil menghapus data milik " + element.nim,1))
            .catch(_err => drawAlert("gagal menghapus data!",3))
        })
    }
    tr.appendChild(td)
    return tr
}