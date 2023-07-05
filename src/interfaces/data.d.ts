export interface DATA_JSON {
    last_fetched: number,
    kelas: string,
    matkul: string,
    data: DATA_INTERFACE[]
}

export interface DATA_INTERFACE {
    nim: string
    name: string,
    file_name: string,
    date: number
}