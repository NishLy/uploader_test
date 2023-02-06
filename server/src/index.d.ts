export interface UPLOADER_CONFIGURATION {
    end: number,
    dir: string,
    matkul: string,
    kelas: string,
    file_types: string[]
    format_name: number
    uploader_name: string,
    choiches: string[] | null,
    max_size : number
}

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