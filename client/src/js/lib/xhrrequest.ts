
export enum HTTP { post = "POST", put = "PUT", delete = "DELETE", get = "GET" }

interface requestConfigutation {
    url: string,
    method: HTTP,
    body?: XMLHttpRequestBodyInit
    header?: Headers
    abortOn?: (xhr: XMLHttpRequest) => void
}

interface requestEventListener {
    onLoad?: ((this: XMLHttpRequest, ev: ProgressEvent) => void)
    onError?: ((this: XMLHttpRequest, ev: ProgressEvent) => void)
    onProgress?: ((this: XMLHttpRequest, ev: ProgressEvent) => void)
}

export interface xhrRequestError { status: number, message: Response | string }


/**
 * It's a function that takes a request configuration object and an optional request event listener
 * object and returns a promise that resolves with an object that has a res property that is the
 * response of the xhr request and a type property that is the type of the response or rejects with an
 * object that has a status and a message. The status is the status of the xhr request and the message
 * is the response of the xhr request or an error message.
 * </code>
 * 
 * 
 * A:
 * 
 * I think you should use <code>Promise.all</code> to wait for all the promises to resolve.
 * <code>Promise.all(promises).then(() =&gt; {
 *   // all promises resolved
 * });
 * </code>
 * @param {requestConfigutation} request - requestConfigutation - The request configuration object.
 * @param {requestEventListener} [callback] - requestEventListener
 * @returns A promise that resolves with an object that has a res property that is the response of the
 * xhr request and a type property that is the type of the response.
 */
export default function xhrRequest(request: requestConfigutation, callback?: requestEventListener): Promise<{ res: Response, type: string }> {

    return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()

        xhr.onreadystatechange = () => {
            if (xhr.readyState !== XMLHttpRequest.DONE) return

           /* Checking if the status of the xhr request is 0 or if the status of the xhr request is
           greater than or equal to 200 and less than 400. If it is it will resolve the promise with
           an object that has a res property that is the response of the xhr request and a type
           property that is the type of the response. */
            if (xhr.status === 0 || (xhr.status >= 200 && xhr.status < 400)) resolve({ res: xhr.response, type: xhr.getResponseHeader('content-type')!.split('/')[1].split(';')[0] })


            /* Rejecting the promise with an object that has a status and a message. The status is the
            status of the xhr request and the message is the response of the xhr request or an error
            message. */
            reject({ status: xhr.status, message: xhr.response || `Error fetching '${request.url}' method='${request.method}'` } as xhrRequestError)
        }


        //adevent listener

        /* A callback function that is called when the request is aborted. */
        if (request.abortOn) request.abortOn(xhr)
        /* Checking if the callback has a property called onProgress and if it does it will add an event
        listener to the xhr.upload object. */
        if (callback?.onProgress) xhr.upload.addEventListener("progress", callback.onProgress)

        /* Checking if the request has a body and if it does it will send the request with the body. If
        it doesn't it will send the request without a body. */
        xhr.open(request.method, request.url)
        request.body ? xhr.send(request.body) : xhr.send()
    })

}