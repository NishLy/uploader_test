export function parseConfigLogs(json: any) {
    if (!json) return null
    const data = JSON.parse(json)
    delete data.last_modified
    delete data.data
    delete data.ip
    delete data.username
    delete data.password
    delete data.iat
    delete data.exp
    return data
}

/**
 * It takes a JSON string and returns the data property of the parsed JSON object
 * @param {any} json - any - the JSON string to parse
 * @returns The data.data property of the parsed JSON.
 */
export function parseDataLogs(json: any) {
    if (!json) return null
    const data = JSON.parse(json) ?? null
    return data?.data
}