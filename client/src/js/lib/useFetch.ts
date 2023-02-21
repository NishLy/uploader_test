export enum HTTP { post = "POST", put = "PUT", delete = "DELETE", get = "GET" }

interface FETCH_INTERFACE {
    url: string
    body?: BodyInit
    method: HTTP
    token?: string,
    type?: string
}

interface FETCH_CALLBACK {
    onCompleted?: (data: {}) => void
    onfail?: (param: any, data: {}) => void
    onabbort?: (param: any, data : {}) => void
    onfinal?: (param: {}) => void
}

const useFetch = async (
    { url, body, method, token = "", type }: FETCH_INTERFACE,
    { onCompleted: oncomplete, onabbort, onfail, onfinal }: FETCH_CALLBACK) => {

    const controller = new AbortController();
    const signal = controller.signal;
    let data = null

    try {
        const res = await fetch(url,
            {
                method: method, body, signal,
                headers: type ? {} : { 'Content-Type': 'application/json', 'authorization': "Bearer " + token }
            })

        data = await res.json()
        if (!res.ok) throw new Error("!ok")
        return oncomplete && oncomplete(data)
    } catch (err) {
        if (err.name === 'AbortError') if (onabbort) return onabbort(err, data)
        if (err === "!ok") if (onfail) return onfail(err, data)
    } finally {
        return onfinal && onfinal(data)
    }
}

export default useFetch