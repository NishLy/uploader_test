
/**
 * It creates a div element, adds a class to it, and appends it to the DOM.
 * @param {String} err - String - The error message to display
 * @param {number} [code] - 1 = success, 2 = warning, 3 = error, 0 = default
 * @param [autoDelete=true] - boolean -&gt; if true, the alert will be removed after 5 seconds.
 * @param [customElements] - This is a string that will be inserted into the div.
 * @returns A function that removes the div.
 */
export const drawAlert = (err: String, code?: number, autoDelete = true, customElements = "") => {
    const container = document.querySelector('#error-modal');
    container?.classList.add('grid')
    let colors: string

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
        default:
            colors = "bg-transparent"
            break;
    }

    const div = document.createElement('div')
    div.className = `h-10 flex justify-center items-center w-[80%] bg text-center uppercase mx-auto text-white overflow-hidden rounded-md ${colors}`
    customElements === "" ? div.innerHTML = `<h1>${err}</h1>` : div.innerHTML = customElements
    container?.appendChild(div)

    if (autoDelete) {
        setTimeout(() => div.remove(), 5000);
        return
    }

    function unmountAlert() {
        div.remove()
    }

    return unmountAlert
}

