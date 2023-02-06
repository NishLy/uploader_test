import multer from "multer";
import path from "path"

export interface FileStorageInterface { dir: string, kelas: string, matkul: string, tipe_soal: undefined | string }

export function defaultStorage() {
    const diskStorage = multer.diskStorage({
        destination: function (_req, _file, cb) {
            cb(null, "/uploads")
        },
        filename: function (_req, file, cb) {
            cb(null, file.fieldname + path.extname(file.originalname))
        }
    })
    return diskStorage
}


export function customStorage({ dir, kelas, matkul, tipe_soal }: FileStorageInterface) {
    const diskStorage = multer.diskStorage({
        destination: function (_req, _file, cb) {
            cb(null, dir)
        },
        filename: function (_req, file, cb) {
            cb(null, file.fieldname + path.extname(file.originalname))
        }
    })
    return diskStorage
}

