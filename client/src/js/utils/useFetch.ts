export enum HTTPMethod { post = "POST", put = "PUT", delete = "DELETE", get = "GET" }
interface fetch {
    url: string
    body?: BodyInit
    method: HTTPMethod
    token?: string,
    type?: string
}

interface callback {
    oncomplete: (param: any) => void
    onfail?: (param: any) => void
    onabbort?: (param: any) => void
    onfinal?: () => void
}

export default async function useFetch({ url, body, method, token = "", type }: fetch, { oncomplete, onabbort, onfail, onfinal }: callback = { oncomplete: () => null }) {
    const controller = new AbortController();
    const signal = controller.signal;
    console.trace('fetch');
    try {
        const res = await fetch(url, { method: method, body, signal, headers: type ? {} : { 'Content-Type': 'application/json', 'authorization': token } })
        if (!res.ok) throw new Error("!ok")
        const data = await res.json()
        return oncomplete(data)
    } catch (err) {
        if (err.name === 'AbortError')
            if (onabbort) return onabbort(err)
        if (err === "!ok")
            if (onfail) return onfail(err)
        onfail && onfail(err)
    } finally {
        return onfinal && onfinal()
    }
}