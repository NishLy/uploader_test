export const drawAlert = (err: String, code = 3) => {
    const container = document.querySelector('#error-modal');
    container?.classList.add('grid')
    let colors = ""
    
    switch (code) {
        case 1:
            colors = "bg-green-700"
            break;
        case 2:
            colors = "bg-yellow-700"
            break;
        case 3:
            colors = "bg-red-700"
            break;
    }


    const div = document.createElement('div')
    div.innerHTML = `<div class="h-6 w-[60%] text-center uppercase mx-auto text-white rounded-sm ${colors}">${err}</div>`
    container?.appendChild(div)
    setTimeout(() => div.remove(), 5000);
}

